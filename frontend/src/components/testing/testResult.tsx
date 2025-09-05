// components/testing/test-results.tsx - Display API test results

'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ApiTestResult } from '@/lib/types';
import { formatResponseTime, copyToClipboard, safeJsonStringify } from '@/lib/utils';
import { CheckCircle, XCircle, Copy, Clock, Database } from 'lucide-react';

interface TestResultsProps {
  result: ApiTestResult;
}

export function TestResults({ result }: TestResultsProps) {
  const handleCopyResponse = async () => {
    if (result.dataPreview?.sample) {
      const json = safeJsonStringify(result.dataPreview.sample);
      await copyToClipboard(json);
    }
  };

  return (
    <div className="space-y-4">
      {/* Status Card */}
      <Card className={result.success ? 'border-green-200' : 'border-red-200'}>
        <CardHeader>
          <div className="flex items-center space-x-2">
            {result.success ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600" />
            )}
            <CardTitle className={result.success ? 'text-green-600' : 'text-red-600'}>
              {result.success ? 'Test Successful' : 'Test Failed'}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4 text-gray-500" />
              <span>{formatResponseTime(result.responseTime)}</span>
            </div>
            {result.dataPreview && (
              <div className="flex items-center space-x-1">
                <Database className="w-4 h-4 text-gray-500" />
                <span>
                  {result.dataPreview.type === 'array' 
                    ? `Array (${result.dataPreview.length} items)`
                    : `Object (${result.dataPreview.fields?.length || 0} fields)`
                  }
                </span>
              </div>
            )}
          </div>
          {result.error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{result.error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Preview */}
      {result.success && result.dataPreview && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Response Preview</CardTitle>
                <CardDescription>
                  Data structure and sample content
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={handleCopyResponse}>
                <Copy className="w-4 h-4 mr-1" />
                Copy JSON
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Data Type Info */}
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <div className="text-sm">
                <strong>Type:</strong> {result.dataPreview.type}
                {result.dataPreview.length && (
                  <span className="ml-4">
                    <strong>Length:</strong> {result.dataPreview.length} items
                  </span>
                )}
              </div>
              {result.dataPreview.fields && result.dataPreview.fields.length > 0 && (
                <div className="mt-2">
                  <strong className="text-sm">Fields:</strong>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {result.dataPreview.fields.slice(0, 10).map((field, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                      >
                        {field}
                      </span>
                    ))}
                    {result.dataPreview.fields.length > 10 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        +{result.dataPreview.fields.length - 10} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sample Data */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Sample Data:</h4>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm whitespace-pre-wrap">
                  {safeJsonStringify(result.dataPreview.sample)}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Integration Tips */}
      {result.success && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ready to Add to Group?</CardTitle>
            <CardDescription>
              This API is working correctly and can be added to a group
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Response Time:</strong> {formatResponseTime(result.responseTime)} 
                  {result.responseTime > 10000 && (
                    <span className="text-orange-600 ml-1">(Consider optimizing for better performance)</span>
                  )}
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Data Format:</strong> Compatible with DataForge aggregation
                  {result.dataPreview?.type === 'array' && (
                    <span className="text-blue-600 ml-1">(Will be merged with other APIs)</span>
                  )}
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Fields Available:</strong> {result.dataPreview?.fields?.length || 0} unique fields
                  for data analysis
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm">
                💡 <strong>Next Step:</strong> Create a group or add this API to an existing group 
                to start aggregating data with other endpoints.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}