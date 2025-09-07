import { toast } from 'sonner';

// Copy data to clipboard as JSON or CSV
export const copyToClipboard = async (data: Record<string, unknown>[], format: 'json' | 'csv') => {
  try {
    let content: string;
    
    if (format === 'json') {
      content = JSON.stringify(data, null, 2);
    } else {
      content = convertToCSV(data);
    }
    
    await navigator.clipboard.writeText(content);
    toast.success(`${format.toUpperCase()} copied to clipboard!`);
  } catch (error) {
    toast.error(`Failed to copy ${format.toUpperCase()}`);
    console.error('Copy error:', error);
  }
};

// Download data as JSON or CSV file
export const downloadData = (data: Record<string, unknown>[], format: 'json' | 'csv', filename?: string) => {
  try {
    let content: string;
    let mimeType: string;
    let extension: string;
    
    if (format === 'json') {
      content = JSON.stringify(data, null, 2);
      mimeType = 'application/json';
      extension = 'json';
    } else {
      content = convertToCSV(data);
      mimeType = 'text/csv';
      extension = 'csv';
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = `${filename || 'aggregated-data'}.${extension}`;
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success(`${format.toUpperCase()} downloaded successfully!`);
  } catch (error) {
    toast.error(`Failed to download ${format.toUpperCase()}`);
    console.error('Download error:', error);
  }
};

// Helper function to convert array of objects to CSV
const convertToCSV = (data: Record<string, unknown>[]): string => {
  if (data.length === 0) return '';
  
  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Create CSV header row
  const csvHeaders = headers.map(header => `"${header}"`).join(',');
  
  // Create CSV data rows
  const csvRows = data.map(row => 
    headers.map(header => {
      const value = row[header];
      // Handle null, undefined, and string values
      if (value === null || value === undefined) {
        return '""';
      }
      return `"${String(value).replace(/"/g, '""')}"`;
    }).join(',')
  );
  
  return [csvHeaders, ...csvRows].join('\n');
};
