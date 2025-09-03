// Converts merged JSON to CSV for analysts
export class CsvExporter {
  
  /**
   * Convert merged API data to CSV format for analysts to use in Excel/BI tools
   */
  static exportToCsv(data: any[], groupName: string): string {
    if (!data || data.length === 0) {
      return `# No data available for group: ${groupName}\n# Generated at: ${new Date().toISOString()}`;
    }

    console.log(`📊 Exporting ${data.length} records to CSV for group: ${groupName}`);

    const headers = this.extractHeaders(data);
    console.log(`📋 CSV will have ${headers.length} columns`);
    
    const csvRows: string[] = [];
    
    // Add metadata comments
    csvRows.push(`# API Aggregator Export`);
    csvRows.push(`# Group: ${groupName}`);
    csvRows.push(`# Records: ${data.length}`);
    csvRows.push(`# Generated: ${new Date().toISOString()}`);
    csvRows.push('');
    
    // Add header row
    csvRows.push(headers.join(','));
    
    // Add data rows
    data.forEach((item, index) => {
      try {
        const row = headers.map(header => {
          const value = this.getNestedValue(item, header);
          return this.escapeCsvValue(value);
        });
        csvRows.push(row.join(','));
      } catch (error) {
        console.warn(`⚠️ Error processing row ${index}:`, error);
        csvRows.push(headers.map(() => '').join(','));
      }
    });
    
    const csvContent = csvRows.join('\n');
    console.log(`✅ CSV export complete: ${csvRows.length - 6} data rows`);
    
    return csvContent;
  }

  private static extractHeaders(data: any[]): string[] {
    const headerSet = new Set<string>();
    
    // Sample from multiple records to ensure we get all fields
    const sampleSize = Math.min(10, data.length);
    const samples = data.slice(0, sampleSize);
    
    samples.forEach(item => {
      this.addObjectHeaders(item, '', headerSet);
    });
    
    // Sort headers: regular fields first, then source fields
    const headers = Array.from(headerSet);
    const sourceHeaders = headers.filter(h => h.startsWith('_source'));
    const regularHeaders = headers.filter(h => !h.startsWith('_source')).sort();
    
    return [...regularHeaders, ...sourceHeaders];
  }

  private static addObjectHeaders(obj: any, prefix: string, headerSet: Set<string>): void {
    if (obj === null || obj === undefined) return;
    
    if (typeof obj === 'object' && !Array.isArray(obj)) {
      Object.keys(obj).forEach(key => {
        const newPrefix = prefix ? `${prefix}.${key}` : key;
        
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
          headerSet.add(newPrefix);
          this.addObjectHeaders(obj[key], newPrefix, headerSet);
        } else {
          headerSet.add(newPrefix);
        }
      });
    } else {
      headerSet.add(prefix);
    }
  }

  private static getNestedValue(obj: any, path: string): any {
    try {
      return path.split('.').reduce((current, key) => {
        return current && current[key] !== undefined ? current[key] : null;
      }, obj);
    } catch (error) {
      return null;
    }
  }

  private static escapeCsvValue(value: any): string {
    if (value === null || value === undefined) return '';
    
    let stringValue: string;
    if (typeof value === 'object') {
      stringValue = JSON.stringify(value);
    } else {
      stringValue = String(value);
    }
    
    // Escape CSV special characters
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n') || stringValue.includes('\r')) {
      stringValue = stringValue.replace(/"/g, '""');
      stringValue = `"${stringValue}"`;
    }
    
    return stringValue;
  }
}
