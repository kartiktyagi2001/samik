import axios from 'axios';
import { ResponseMerger } from './ResponseMerger.js'; // htis is how TypeScript + NodeNext + verbatimModuleSyntax resolve imports.
export class ApiAggregator {
    responseMerger = new ResponseMerger();
    async aggregateApiGroup(apiSources, groupName) {
        const startTime = Date.now();
        console.log(`Starting aggregation for group: ${groupName}`);
        console.log(`APIs to process: ${apiSources.length}`);
        // Only call active APIs
        const activeApis = apiSources.filter(api => api.isActive);
        console.log(`Active APIs: ${activeApis.length}/${apiSources.length}`);
        if (activeApis.length === 0) {
            throw new Error('No active APIs found in this group');
        }
        //call all endpoints at the same time (not one by one)
        const apiPromises = activeApis.map(api => this.callSingleApi(api)); //calling individual apis
        const results = await Promise.allSettled(apiPromises);
        //result
        const successfulResponses = [];
        const apiMetadata = [];
        results.forEach((result, index) => {
            const api = activeApis[index];
            if (api && result.status === 'fulfilled') {
                successfulResponses.push({
                    apiName: api.name,
                    data: result.value.data
                });
                apiMetadata.push({
                    apiName: api.name,
                    success: true,
                    responseTime: result.value.responseTime,
                    recordCount: Array.isArray(result.value.data) ? result.value.data.length : 1
                });
                console.log(`${api.name}: ${result.value.responseTime}ms`);
            }
            else if (api && result.status === 'rejected') {
                apiMetadata.push({
                    apiName: api.name,
                    success: false,
                    responseTime: 0,
                    error: result.reason.message
                });
                console.log(`${api.name}: ${result.reason.message}`);
            }
        });
        if (successfulResponses.length === 0) {
            throw new Error('All APIs failed to respond');
        }
        //merge all successful responses: maagicc! :)
        const mergedData = this.responseMerger.mergeResponses(successfulResponses);
        const totalTime = Date.now() - startTime;
        console.log(`Aggregation complete: ${successfulResponses.length}/${activeApis.length} successful in ${totalTime}ms`);
        console.log(`Merged records: ${mergedData.length}`);
        return {
            success: true,
            data: mergedData,
            metadata: {
                totalAPIs: activeApis.length,
                successfulAPIs: successfulResponses.length,
                failedAPIs: activeApis.length - successfulResponses.length,
                responseTime: totalTime,
                timestamp: new Date().toISOString(),
                groupName,
                sources: apiMetadata
            }
        };
    }
    //call individual apis with proper error handling and timeouts
    async callSingleApi(apiSource) {
        const startTime = Date.now();
        try {
            //test log
            console.log(`calling ${apiSource.name}: ${apiSource.method} ${apiSource.url}`);
            const response = await axios({
                method: apiSource.method,
                url: apiSource.url,
                headers: apiSource.headers || {},
                params: apiSource.queryParams || {},
                timeout: apiSource.timeout,
                validateStatus: (status) => status < 500, // Accept 4xx as valid
                maxRedirects: 5
            });
            const responseTime = Date.now() - startTime;
            return {
                data: response.data,
                responseTime
            };
        }
        catch (error) {
            const responseTime = Date.now() - startTime;
            let errorMessage = 'Unknown error';
            if (error.code === 'ECONNABORTED') {
                errorMessage = `Timeout after ${apiSource.timeout}ms`;
            }
            else if (error.response) {
                errorMessage = `HTTP ${error.response.status}: ${error.response.statusText}`;
            }
            else if (error.request) {
                errorMessage = 'No response received';
            }
            else {
                errorMessage = error.message;
            }
            throw new Error(errorMessage);
        }
    }
    //test individual api before adding to group
    async testApi(apiRequest) {
        const startTime = Date.now();
        try {
            const tempApiSource = {
                id: '0',
                name: apiRequest.name,
                url: apiRequest.url,
                method: apiRequest.method || 'GET',
                headers: apiRequest.headers || {},
                queryParams: apiRequest.queryParams || {},
                timeout: apiRequest.timeout || 30000,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                groupId: '0'
            };
            const result = await this.callSingleApi(tempApiSource);
            return {
                success: true,
                responseTime: result.responseTime,
                dataPreview: this.createDataPreview(result.data)
            };
        }
        catch (error) {
            const responseTime = Date.now() - startTime;
            return {
                success: false,
                responseTime,
                error: error.message
            };
        }
    }
    createDataPreview(data) {
        if (Array.isArray(data)) {
            return {
                type: 'array',
                length: data.length,
                sample: data.slice(0, 3),
                fields: data.length > 0 && typeof data[0] === 'object' ? Object.keys(data[0] || {}) : []
            };
        }
        else if (typeof data === 'object' && data !== null) {
            return {
                type: 'object',
                fields: Object.keys(data),
                sample: data
            };
        }
        else {
            return {
                type: typeof data,
                sample: data
            };
        }
    }
}
//# sourceMappingURL=ApiAggregator.js.map