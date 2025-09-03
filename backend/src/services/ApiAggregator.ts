import axios from 'axios';
import type { AxiosResponse } from 'axios';
import {ResponseMerger} from './ResponseMerger'; // htis is how TypeScript + NodeNext + verbatimModuleSyntax resolve imports.
import type { ApiSource, AggregatedResponse, ApiResponseMeta, ApiTestRequest, ApiTestResult } from '../types.js';

export class ApiAggregator {
  private responseMerger = new ResponseMerger();


  async aggregateApiGroup(apiSources: ApiSource[], groupName: string): Promise<AggregatedResponse> {
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
    const apiPromises = activeApis.map(api => this.callSingleApi(api));  //calling individual apis
    const results = await Promise.allSettled(apiPromises);
    
    //result
    const successfulResponses: Array<{ apiName: string; data: any }> = [];
    const apiMetadata: ApiResponseMeta[] = [];
    
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
      } else if (api && result.status === 'rejected') {
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
  private async callSingleApi(apiSource: ApiSource): Promise<{ data: any; responseTime: number }> {
    const startTime = Date.now();
    
    try {

      //test log
      console.log(`calling ${apiSource.name}: ${apiSource.method} ${apiSource.url}`);
      
      const response: AxiosResponse = await axios({
        method: apiSource.method as any,
        url: apiSource.url,
        headers: (apiSource.headers as Record<string, string>) || {},
        params: (apiSource.queryParams as Record<string, any>) || {},
        timeout: apiSource.timeout,
        validateStatus: (status) => status < 500, // Accept 4xx as valid
        maxRedirects: 5
      });
      
      const responseTime = Date.now() - startTime;
      
      return {
        data: response.data,
        responseTime
      };
      
    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      
      let errorMessage = 'Unknown error';
      if (error.code === 'ECONNABORTED') {
        errorMessage = `Timeout after ${apiSource.timeout}ms`;
      } else if (error.response) {
        errorMessage = `HTTP ${error.response.status}: ${error.response.statusText}`;
      } else if (error.request) {
        errorMessage = 'No response received';
      } else {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  }

  //test individual api before adding to group
  async testApi(apiRequest: ApiTestRequest): Promise<ApiTestResult> {
    const startTime = Date.now();
    
    try {
      const tempApiSource: ApiSource = {
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
      
    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      
      return {
        success: false,
        responseTime,
        error: error.message
      };
    }
  }

  private createDataPreview(data: any): any {
    if (Array.isArray(data)) {
      return {
        type: 'array',
        length: data.length,
        sample: data.slice(0, 3),
        fields: data.length > 0 && typeof data[0] === 'object' ? Object.keys(data[0] || {}) : []
      };
    } else if (typeof data === 'object' && data !== null) {
      return {
        type: 'object',
        fields: Object.keys(data),
        sample: data
      };
    } else {
      return {
        type: typeof data,
        sample: data
      };
    }
  }
}
