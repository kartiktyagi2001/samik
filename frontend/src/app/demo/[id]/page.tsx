'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { demoApi } from '@/lib/api';
import { ApiGroup, ApiSource } from '@/lib/types';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Plus, Trash2, ChevronLeft } from 'lucide-react';

export default function GroupDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = Array.isArray(params.id) ? params.id[0] : params.id || '';

  const [group, setGroup] = useState<ApiGroup | null>(null);
  const [loading, setLoading] = useState(true);

  // Add API form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newApiName, setNewApiName] = useState('');
  const [newApiUrl, setNewApiUrl] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!groupId) {
      setLoading(false);
      return;
    }
    
    async function loadGroup() {
      setLoading(true);
      try {
        const res = await demoApi.getById(groupId);
        if (res.success && res.data) {
          setGroup(res.data);
        } else {
          toast.error(res.error || 'Failed to load group');
        }
      } catch(err) {
        toast.error(`${err}`);
      } finally {
        setLoading(false);
      }
    }
    loadGroup();
  }, [groupId]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const handleAddApi = async () => {
    if (!newApiName || !newApiUrl) {
      toast.error('API name and URL are required');
      return;
    }
    setAdding(true);
    const res = await demoApi.addApi(groupId, {
      name: newApiName,
      url: newApiUrl,
      method: 'GET',
      timeout: 30000,
    });
    setAdding(false);

    if (res.success && res.data && group) {
        const updated = {
            ...group,
            apiSources: [...group.apiSources, res.data],
            _count: {
                ...group._count,
                apiSources: group._count.apiSources + 1
            }
        };
        setGroup(updated);
        toast.success('API added');
    } else {
      toast.error(res.error || 'Failed to add API');
    }
  };

  const handleRemoveApi = async (apiId: string) => {
    if (!confirm('Remove this API?')) return;
    const res = await demoApi.removeApi(groupId, apiId);
    if (res.success) {
      setGroup(prev => prev ? {
        ...prev,
        apiSources: prev.apiSources.filter(api => api.id !== apiId),
        _count: { ...prev._count, apiSources: prev._count.apiSources - 1 }
      } : null);
      toast.success('API removed');
    } else {
      toast.error(res.error || 'Failed to remove API');
    }
  };

  const handleDeleteGroup = async () => {
    if (!confirm('Delete this entire group? This cannot be undone.')) return;
    const res = await demoApi.delete(groupId);
    if (res.success) {
      toast.success('Group deleted');
      router.push('/groups');
    } else {
      toast.error(res.error || 'Failed to delete group');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <p className="text-lg">Loading group details...</p>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <p className="text-lg">Group not found</p>
      </div>
    );
  }

  const aggregateUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/aggregate/${encodeURIComponent(group.name)}`;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        
        <div>
          <h1 className="text-3xl font-bold">{group.name}</h1>
          <p className="text-gray-600 mt-1">
            {group.description || 'No description provided'}
          </p>
        </div>

        <Button 
          variant="outline"
          onClick={() => router.back()}
          className="border-black hover:bg-black hover:text-white"
        >
          <ChevronLeft />
        </Button>
      </div>

      {/* group cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-black p-4 rounded">
          <h3 className="font-medium text-sm text-gray-600">APIs</h3>
          <p className="text-2xl font-bold">{group._count.apiSources}</p>
        </div>
        <div className="border border-black p-4 rounded">
          <h3 className="font-medium text-sm text-gray-600">Requests</h3>
          <p className="text-2xl font-bold">{group._count.requests}</p>
        </div>
        <div className="border border-black p-4 rounded">
          <h3 className="font-medium text-sm text-gray-600">Status</h3>
          <p className="text-2xl font-bold">{group.isActive ? 'Active' : 'Inactive'}</p>
        </div>
      </div>

      {/* group aggr endpoint */}
      <div className="border border-black p-4 rounded">
        <h3 className="font-medium mb-2">Group Endpoint <span className='text-xs text-center'>(copy to use)</span></h3>
        <div className="flex items-center gap-2">
          <code className="bg-gray-100 px-3 py-2 rounded flex-1 text-sm">
            {aggregateUrl}
          </code>
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(aggregateUrl)}
            className="border-black hover:bg-black hover:text-white"
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* APIs Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">APIs ({group.apiSources.length})</h2>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-black text-white hover:bg-black/90"
            disabled
          >
            <Plus className="w-4 h-4 mr-2" />
            Add API
          </Button>
        </div>

        {/* Add API Form */}
        {showAddForm && (
          <div className="border border-black p-4 rounded mb-4">
            <h3 className="font-medium mb-3">Add New API</h3>
            <div className="space-y-3">
              <Input
                placeholder="API Name"
                value={newApiName}
                onChange={e => setNewApiName(e.target.value)}
                className="border-black"
              />
              <Input
                placeholder="API URL"
                value={newApiUrl}
                onChange={e => setNewApiUrl(e.target.value)}
                className="border-black"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleAddApi}
                  disabled={adding}
                  className="bg-black text-white hover:bg-black/90"
                >
                  {adding ? 'Adding...' : 'Add API'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewApiName('');
                    setNewApiUrl('');
                  }}
                  className="border-black hover:bg-black hover:text-white"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* APIs List */}
        {group.apiSources.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No APIs added yet</p>
        ) : (
          <div className="space-y-3">
            {group.apiSources.map((api: ApiSource) => (
              <div key={api.id} className="border border-black p-4 rounded">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <span className="font-medium">{api.name}</span>
                    <p className="text-sm text-gray-600 mt-1">{api.method}</p>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 inline-block">
                      {api.url}
                    </code>
                    <div className="mt-2 text-xs text-gray-500">
                      <span>Timeout: {api.timeout}ms</span>
                      <span className="ml-4">Status: {api.isActive ? 'Active' : 'Inactive'}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveApi(api.id)}
                    className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white ml-4"
                    disabled
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="border-t border-black pt-6 flex justify-between">
        <Button
          variant="outline"
          onClick={() => router.push('/groups')}
          className="border-black hover:bg-black hover:text-white"
        >
          <ChevronLeft />
        </Button>
        <Button
          onClick={handleDeleteGroup}
          className="bg-red-600 text-white hover:bg-red-700"
          disabled
        >
          Delete Group
        </Button>
      </div>
    </div>
  );
}
