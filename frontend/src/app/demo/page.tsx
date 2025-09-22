'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { demoApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

import {
  Copy,
  ThumbsUp,
  Zap,
  LoaderCircle,
  Plus,
} from 'lucide-react';

interface GroupInfo {
  id: string;
  name: string;
  description?: string;
  apiCount?: number;
  backendUrl: string;
}


export default function DemoPage() {
  const router = useRouter();

  const [groups, setGroups] = useState<GroupInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [creating, setCreating] = useState(false);

  //load demo groups
  useEffect(() => {
    //fetch demo groups
    demoApi.getAll().then((res) => {
      setLoading(true);
      if (res.success && res.data) {
        setGroups(
          res.data.map((g) => ({
            id: g.id,
            name: g.name,
            description: g.description,
            apiCount: g._count.apiSources,
            backendUrl: `${process.env.NEXT_PUBLIC_API_URL}/demo/${encodeURIComponent(
              g.name
            )}`,
          }))
        );
      } else {
        if (res.error) toast.error(res.error);
        toast.error('Failed to load demo groups.');
      }
      setLoading(false);
    });
  }, []);

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    toast('Copied to clipboard!', { icon: <ThumbsUp /> });
  };

  const handleEdit = (groupId: string) => {
    router.push(`/demo/${groupId}`);
  };

  const handleRun = (groupName: string) => {
    router.push(`/demo/response/${encodeURIComponent(groupName)}`);
  };

  const handleCreateNew = async () => {
    if (!groupName.trim()) {
      toast.error('Group Name Required!');
      return;
    }
    setCreating(true);
    const payload = { name: groupName, ...(groupDescription && { description: groupDescription }) };
    const res = await demoApi.create(payload);
    setCreating(false);
    setShowCreateForm(false);
    if (res.success && res.data) {
      const newGroup: GroupInfo = {
        id: res.data.id,
        name: res.data.name,
        description: res.data.description,
        apiCount: 0,
        backendUrl: `${process.env.NEXT_PUBLIC_API_URL}/demo/${encodeURIComponent(
          res.data.name
        )}`,
      };
      setGroups((prev) => [...prev, newGroup]);
      toast.success('New Demo Group Created!');

      //test log
      console.log(newGroup);
    } else {
      toast.error(res.error || 'Failed to Create Demo Group, please try again!');
    }
  };


  if (loading) {
    return (
      <div className='flex text-center py-8 items-center justify-center min-h-[80vh]'>
        <p className="flex text-center py-8 items-center justify-center">
          {/* <Spinner size="lg" /> */}
          Loading...
        </p>
      </div>
    );
  }

  if (groups.length === 0) {
  return (
      <div className="px-4 py-8 flex flex-col items-center">
        <div className="flex justify-between items-center w-full max-w-full mb-10">
          <h1 className="text-3xl font-semibold">Demo API Groups</h1>
          <Button
            className="hover:bg-black/70 border-black"
            onClick={() => setShowCreateForm((v) => !v)}
            // disabled
          >
            <Plus /> New
          </Button>
        </div>

        <p className="mb-10 text-gray-700">No demo groups available.</p>

        <div className="w-full max-w-full">
          {showCreateForm && (
            <div className="border border-black p-6 rounded-md">
              <h3 className="font-semibold mb-4">Create New Demo Group</h3>
              <div className="space-y-4">
                <Input
                  placeholder="Group Name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="border-black"
                />
                <Input
                  placeholder="Description"
                  value={groupDescription}
                  onChange={(e) => setGroupDescription(e.target.value)}
                  className="border-black"
                />
                <div className="flex gap-3">
                  <Button
                    onClick={handleCreateNew}
                    disabled={creating}
                    className="bg-black text-white hover:bg-black/90"
                  >
                    {creating ? 'Creating...' : 'Create'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                    className="border-black hover:bg-black hover:text-white"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Demo API Groups</h1>
        <Button
          className="hover:bg-black/70 border-black"
          onClick={() => setShowCreateForm((v) => !v)}
          disabled
        >
          <Plus /> New
        </Button>
      </div>

      {showCreateForm && (
        <div className="border border-black p-4 rounded mb-10">
          <h3 className="font-medium mb-3">Create New Demo Group</h3>
          <div className="space-y-3">
            <Input
              placeholder="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="border-black"
            />
            <Input
              placeholder="Description"
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
              className="border-black"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleCreateNew}
                disabled={creating}
                className="bg-black text-white hover:bg-black/90"
              >
                {creating ? 'Creating...' : 'Create'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCreateForm(false)}
                className="border-black hover:bg-black hover:text-white"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <div
            key={group.id}
            className="border border-black p-6 rounded-md flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-semibold text-black">{group.name}</h2>
              {group.description && (
                <p className="mt-2 text-sm text-gray-700">{group.description}</p>
              )}
            </div>

            <div className="mt-4">
              <p className="text-sm text-black">
                APIs: <span className="font-medium">{group.apiCount}</span>
              </p>
              <div className="mt-3 flex items-center space-x-2">
                <code className="text-xs text-gray-800 bg-gray-100 px-2 py-1 rounded truncate">
                  {group.backendUrl}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-black text-black hover:bg-black hover:text-white"
                  onClick={() => handleCopy(group.backendUrl)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="mt-4 flex justify-between">
              <Button
                variant="outline"
                size="sm"
                className="border-black bg-white text-black hover:bg-black hover:text-white"
                onClick={() => handleEdit(group.id)}
              >
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-black bg-black text-white hover:bg-white hover:text-black"
                onClick={() => handleRun(group.name)}
              >
                <Zap className="w-4 h-4" /> Run
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
