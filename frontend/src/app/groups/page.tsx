'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { groupsApi } from '@/lib/api';
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

const authUrl = process.env.NEXT_PUBLIC_AUTH_URL;

export default function GroupsPage() {
  const router = useRouter();

  const [groups, setGroups] = useState<GroupInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const [auth, setAuth] = useState<boolean | null>(null);

  //handle token param, then load groups
  useEffect(() => {
    //extract token from URL if present
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    const urlName = params.get('name');

    if (urlToken) {
      localStorage.setItem('token', urlToken);
      localStorage.setItem('tokenSetAt', Date.now().toString());
      if (urlName) {
        localStorage.setItem('username', urlName);
      }
      // Remove token from URL
      window.history.replaceState({}, '', '/groups');
    }

    //fetch groups
    groupsApi.getAll().then((res) => {
      setLoading(true);
      if (res.success && res.data) {
        setAuth(true);
        setGroups(
          res.data.map((g) => ({
            id: g.id,
            name: g.name,
            description: g.description,
            apiCount: g._count.apiSources,
            backendUrl: `${process.env.NEXT_PUBLIC_API_URL}/api/aggregate/${encodeURIComponent(
              g.name
            )}`,
          }))
        );
      } else {
        setAuth(false);
        if (res.error) toast.error(res.error);
        toast.error('You have been logged out, please login again.');
      }
      setLoading(false);
    });
  }, []);

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    toast('Copied to clipboard!', { icon: <ThumbsUp /> });
  };

  const handleEdit = (groupId: string) => {
    router.push(`/groups/${groupId}`);
  };

  const handleRun = (groupName: string) => {
    router.push(`/groups/response/${encodeURIComponent(groupName)}`);
  };

  const handleCreateNew = async () => {
    if (!groupName.trim()) {
      toast.error('Group Name Required!');
      return;
    }
    setCreating(true);
    const payload = { name: groupName, ...(groupDescription && { description: groupDescription }) };
    const res = await groupsApi.create(payload);
    setCreating(false);
    setShowCreateForm(false);
    if (res.success && res.data) {
      const newGroup: GroupInfo = {
        id: res.data.id,
        name: res.data.name,
        description: res.data.description,
        apiCount: 0,
        backendUrl: `${process.env.NEXT_PUBLIC_API_URL}/api/aggregate/${encodeURIComponent(
          res.data.name
        )}`,
      };
      setGroups((prev) => [...prev, newGroup]);
      toast.success('New Group Created!');

      //test log
      console.log(newGroup);
    } else {
      toast.error(res.error || 'Failed to Create Group, please try again!');
    }
  };

  //redirect if not authenticated
  const [count, setCount] = useState(3); //3 second countdown

  useEffect(() => {
  if (auth === false) {
    if (count === 0) {
      router.push(authUrl || '/login');
      return;
    }
    const timer = setTimeout(() => {
      setCount(c => c - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }
}, [auth, count, router]);

if (auth === false) {
  return (
    <div>
      <p className="text-lg">Your session has expired! Please sign in again.</p>
      <p className="text-sm text-gray-500">Redirecting in {count} second{count > 1 ? 's' : ''}...</p>
    </div>
  );
}

  if (loading) {
    return (
      <p className="flex text-center py-8 items-center justify-center">
        Loading <LoaderCircle className="ml-2" />
      </p>
    );
  }

  if (groups.length === 0) {
  return (
      <div className="px-4 py-8 min-h-screen flex flex-col items-center">
        <div className="flex justify-between items-center w-full max-w-5xl mb-6">
          <h1 className="text-3xl font-semibold">Your API Groups</h1>
          <Button
            className="hover:bg-black/70 border-black"
            onClick={() => setShowCreateForm((v) => !v)}
          >
            <Plus /> New
          </Button>
        </div>

        <p className="mb-6 text-gray-700">No groups available.</p>

        <div className="w-full max-w-md">
          {showCreateForm && (
            <div className="border border-black p-6 rounded-md">
              <h3 className="font-semibold mb-4">Create New Group</h3>
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
    <div className="px-4 py-8 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Your API Groups</h1>
        <Button
          className="hover:bg-black/70 border-black"
          onClick={() => setShowCreateForm((v) => !v)}
        >
          <Plus /> New
        </Button>
      </div>

      {showCreateForm && (
        <div className="border border-black p-4 rounded mb-10">
          <h3 className="font-medium mb-3">Create New Group</h3>
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
