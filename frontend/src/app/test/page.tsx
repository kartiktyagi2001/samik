'use client';

import { useState } from 'react';
import { aggregationApi } from '@/lib/api';
import { ApiTestRequest, ApiTestResult } from '@/lib/types';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export default function ApiTestPage() {
  const [form, setForm] = useState<ApiTestRequest>({
    name: '',
    url: '',
    method: 'GET',
    headers: {},
    queryParams: {},
    timeout: 30000,
  });
  const [result, setResult] = useState<ApiTestResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (key: keyof ApiTestRequest, value: string) => {
    setForm(prev => ({
      ...prev,
      [key]: key === 'timeout' ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.url) {
      toast.error('Name and URL are required');
      return;
    }
    setLoading(true);
    setResult(null);
    const res = await aggregationApi.testApi(form);
    setLoading(false);

    if (res.success && res.data) {
      setResult(res.data);
    } else {
      toast.error(res.error || 'Test API failed');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Test API Endpoint</h1>

      <div className="space-y-4">
        <div>
          <label className="block font-medium">Name</label>
          <input
            type="text"
            placeholder='Api Name'
            value={form.name}
            onChange={e => handleChange('name', e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">URL</label>
          <input
            type="text"
            placeholder='add https:// before url'
            value={form.url}
            onChange={e => handleChange('url', e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Method</label>
          <select
            value={form.method}
            onChange={e => handleChange('method', e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option>GET</option>
            <option>POST</option>
            <option>PUT</option>
            <option>DELETE</option>
            <option>PATCH</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Timeout (ms)</label>
          <input
            type="number"
            value={form.timeout}
            onChange={e => handleChange('timeout', e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-black text-white hover:bg-black/80"
      >
        {loading ? 'Testing...' : 'Run Test'}
      </Button>

      {result && (
        <div className="mt-6 space-y-4">
          <h2 className="text-xl font-medium">Result Preview</h2>
          <div>
            <strong>Success:</strong> {String(result.success)}
          </div>
          <div>
            <strong>Response Time:</strong> {result.responseTime} ms
          </div>
          {result.dataPreview && (
            <div className="mt-2">
              <strong>Data Preview:</strong>
              <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
                {JSON.stringify(result.dataPreview, null, 2)}
              </pre>
            </div>
          )}
          {result.error && (
            <div className="text-red-600">
              <strong>Error:</strong> {result.error}
            </div>
          )}
        </div>
      )}
    </div>
);
}
