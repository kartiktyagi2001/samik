// // lib/csv-export.ts - Client-side CSV conversion utility

// /**
//  * Convert JSON array to CSV format
//  * This replaces the server-side CSV endpoint for better performance
//  */
// export function jsonToCsv(data: unknown[], filename?: string): string {
//   if (!data || data.length === 0) {
//     return '';
//   }

//   // Get all unique headers from the data
//   const headers = getUniqueHeaders(data);
  
//   // Create CSV content
//   const csvRows: string[] = [];
  
//   // Add header row
//   csvRows.push(headers.map(header => escapeCSVValue(header)).join(','));
  
//   // Add data rows
//   data.forEach(row => {
//     const values = headers.map(header => {
//       const value = getNestedValue(row, header);
//       return escapeCSVValue(value);
//     });
//     csvRows.push(values.join(','));
//   });
  
//   return csvRows.join('\n');
// }

// /**
//  * Download CSV file in the browser
//  */
// export function downloadCSV(data: unknown[], filename: string = 'dataforge-export'): void {
//   const csv = jsonToCsv(data, filename);
//   const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//   const link = document.createElement('a');
  
//   if (link.download !== undefined) {
//     const url = URL.createObjectURL(blob);
//     link.setAttribute('href', url);
//     link.setAttribute('download', `${filename}.csv`);
//     link.style.visibility = 'hidden';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   }
// }

// /**
//  * Copy CSV to clipboard
//  */
// export async function copyCSVToClipboard(data: unknown[]): Promise<boolean> {
//   const csv = jsonToCsv(data);
  
//   try {
//     await navigator.clipboard.writeText(csv);
//     return true;
//   } catch (error) {
//     return false;
//   }
// }

// /**
//  * Get all unique headers from nested objects
//  */
// function getUniqueHeaders(data: unknown[]): string[] {
//   const headers = new Set<string>();
  
//   data.forEach(item => {
//     addObjectHeaders(item, '', headers);
//   });
  
//   return Array.from(headers).sort();
// }

// /**
//  * Recursively add object headers (handles nested objects)
//  */
// function addObjectHeaders(obj: [], prefix: string, headers: Set<string>): void {
//   if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
//     Object.keys(obj).forEach(key => {
//       const headerName = prefix ? `${prefix}.${key}` : key;
//       const value = obj[key];
      
//       if (value && typeof value === 'object' && !Array.isArray(value)) {
//         headers.add(headerName);
//         addObjectHeaders(value, headerName, headers);
//       } else {
//         headers.add(headerName);
//       }
//     });
//   }
// }

// /**
//  * Get nested value from object using dot notation
//  */
// function getNestedValue(obj: any, path: string): unknown {
//   return path.split('.').reduce((current, key) => {
//     return current && current[key] !== undefined ? current[key] : '';
//   }, obj);
// }

// /**
//  * Escape CSV values (handle commas, quotes, newlines)
//  */
// function escapeCSVValue(value: unknown): string {
//   if (value === null || value === undefined) {
//     return '';
//   }
  
//   let stringValue = String(value);
  
//   // Handle arrays by joining with semicolons
//   if (Array.isArray(value)) {
//     stringValue = value.join('; ');
//   }
  
//   // Handle objects by stringifying
//   if (typeof value === 'object' && !Array.isArray(value)) {
//     try {
//       stringValue = JSON.stringify(value);
//     } catch {
//       stringValue = '[Object]';
//     }
//   }
  
//   // Escape quotes by doubling them
//   stringValue = stringValue.replace(/"/g, '""');
  
//   // Wrap in quotes if contains comma, quote, or newline
//   if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
//     stringValue = `"${stringValue}"`;
//   }
  
//   return stringValue;
// }

// /**
//  * Validate CSV data before export
//  */
// export function validateCSVData(data: unknown[]): { 
//   isValid: boolean; 
//   error?: string; 
//   rowCount: number;
//   columnCount: number;
// } {
//   if (!Array.isArray(data)) {
//     return {
//       isValid: false,
//       error: 'Data must be an array',
//       rowCount: 0,
//       columnCount: 0
//     };
//   }
  
//   if (data.length === 0) {
//     return {
//       isValid: false,
//       error: 'No data to export',
//       rowCount: 0,
//       columnCount: 0
//     };
//   }
  
//   const headers = getUniqueHeaders(data);
  
//   return {
//     isValid: true,
//     rowCount: data.length,
//     columnCount: headers.length
//   };
// }

// /**
//  * Preview CSV format (first few rows)
//  */
// export function previewCSV(data: unknown[], maxRows: number = 5): string {
//   if (!data || data.length === 0) {
//     return 'No data to preview';
//   }
  
//   const previewData = data.slice(0, maxRows);
//   const csv = jsonToCsv(previewData);
  
//   if (data.length > maxRows) {
//     return csv + `\n... and ${data.length - maxRows} more rows`;
//   }
  
//   return csv;
// }