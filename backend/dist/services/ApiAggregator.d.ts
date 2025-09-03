import type { ApiSource, AggregatedResponse, ApiTestRequest, ApiTestResult } from '../types.js';
export declare class ApiAggregator {
    private responseMerger;
    aggregateApiGroup(apiSources: ApiSource[], groupName: string): Promise<AggregatedResponse>;
    private callSingleApi;
    testApi(apiRequest: ApiTestRequest): Promise<ApiTestResult>;
    private createDataPreview;
}
//# sourceMappingURL=ApiAggregator.d.ts.map