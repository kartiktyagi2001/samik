export class ResponseMerger{

    //take multiple responses and merge them
    mergeResponses(responses: Array<{apiName: string, data: any}>): any[]{
        
        if(responses.length === 0)
            return[];

        //test log
        console.log("merging responses")

        //checking if all responses are arrays or mix
        const allArrays = responses.every(r =>{
            Array.isArray(r.data)
        });
        const mixed = responses.some(r => Array.isArray(r.data) !== allArrays); //has both arrays and objs

        if(allArrays){
            console.log("res has only arrays")
            return this.mergeArrayResponses(responses);
        } else if(mixed){
            console.log("res has arrays and objs")
            return this.mergeMixedResponses(responses);
        } else{
            return this.mergeObjectResponses(responses); //do not have arrays at all, prolly all are objects
        }
    }

    //merge all array res
    private mergeArrayResponses(responses: Array<{ apiName: string; data: any[] }>): any[] {
    const mergedData: any[] = [];
    
    //get all unique fields
    const allFields = this.extractAllFields(responses);
    console.log(`📋 Found ${allFields.size} unique fields across all APIs`);
    
    //process data of each api
    responses.forEach(response => {
      response.data.forEach((item, index) => {
        const normalizedItem = this.normalizeObject(item, allFields);
        normalizedItem._sourceApi = response.apiName;
        normalizedItem._sourceIndex = index;
        mergedData.push(normalizedItem);
      });
    });
    
    return mergedData;
  }

  //merge all obj responses
  private mergeObjectResponses(responses: Array<{ apiName: string; data: any }>): any[] {
    const allFields = this.extractAllFields(responses);
    
    return responses.map((response, index) => {
      const normalizedItem = this.normalizeObject(response.data, allFields);
      normalizedItem._sourceApi = response.apiName;
      normalizedItem._sourceIndex = index;
      return normalizedItem;
    });
  }

  //merge responses with both arrays and objs
  private mergeMixedResponses(responses: Array<{ apiName: string; data: any }>): any[] {
    const mergedData: any[] = [];
    const allFields = this.extractAllFields(responses);
    
    responses.forEach(response => {
      if (Array.isArray(response.data)) {
        response.data.forEach((item, index) => {
          const normalizedItem = this.normalizeObject(item, allFields);
          normalizedItem._sourceApi = response.apiName;
          normalizedItem._sourceIndex = index;
          mergedData.push(normalizedItem);
        });
      } else {
        const normalizedItem = this.normalizeObject(response.data, allFields);
        normalizedItem._sourceApi = response.apiName;
        normalizedItem._sourceIndex = 0;
        mergedData.push(normalizedItem);
      }
    });
    
    return mergedData;
  }

  private extractAllFields(responses: Array<{ apiName: string; data: any }>): Set<string> {
    const fields = new Set<string>();
    
    responses.forEach(response => {
      const items = Array.isArray(response.data) ? response.data : [response.data];
      items.forEach(item => {
        if (item && typeof item === 'object') {
          this.addObjectFields(item, '', fields);
        }
      });
    });
    
    return fields;
  }

  private addObjectFields(obj: any, prefix: string, fields: Set<string>): void {
    Object.keys(obj).forEach(key => {
      const fieldName = prefix ? `${prefix}.${key}` : key;
      const value = obj[key];
      
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        fields.add(fieldName);
        this.addObjectFields(value, fieldName, fields);
      } else {
        fields.add(fieldName);
      }
    });
  }

  private normalizeObject(obj: any, allFields: Set<string>): any {
    const normalized: any = {};
    
    //set all fiels as null initially
    allFields.forEach(field => {
      this.setNestedValue(normalized, field, null);
    });
    
    //replace null with actual value
    if (obj && typeof obj === 'object') {
      this.copyValues(obj, normalized, '');
    }
    
    return normalized;
  }

  private setNestedValue(obj: any, path: string, value: any): void {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    
    let current = obj;
    for (const key of keys) {
      // if (!(key in current) || typeof current[key] !== 'object') //eralier null was not being handled causing error later
      if (!(key in current) || typeof current[key] !== 'object' || current[key] === null) {
        current[key] = {};
      }
      current = current[key];
    }
    
    current[lastKey] = value;
  }

  private copyValues(source: any, target: any, prefix: string): void {
    Object.keys(source).forEach(key => {
      const currentPath = prefix ? `${prefix}.${key}` : key;
      const value = source[key];
      
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        this.copyValues(value, target, currentPath);
      } else {
        this.setNestedValue(target, currentPath, value);
      }
    });
  }
}

// module.exports = ResponseMerger;
