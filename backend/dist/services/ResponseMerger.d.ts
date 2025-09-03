export declare class ResponseMerger {
    mergeResponses(responses: Array<{
        apiName: string;
        data: any;
    }>): any[];
    private mergeArrayResponses;
    private mergeObjectResponses;
    private mergeMixedResponses;
    private extractAllFields;
    private addObjectFields;
    private normalizeObject;
    private setNestedValue;
    private copyValues;
}
//# sourceMappingURL=ResponseMerger.d.ts.map