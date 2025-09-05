'use client';

import React, { useEffect, useState } from 'react';
import { groupsApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
// import { Progress } from '@/components/ui/progress';
import {toast} from 'sonner';
import { Copy, ThumbsUp, Zap, LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

//tem type for  info to be displayed
interface GroupInfo {
  id: string;
  name: string;
  description?: string;
  apiCount: number;
  backendUrl: string;
}

export default function GroupsPage() {

  const router = useRouter();

  const [groups, setGroups] = useState<GroupInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    groupsApi.getAll().then(res => {
      if (res.success && res.data) {
        setGroups(
          res.data.map(g => ({
            id: g.id,
            name: g.name,
            description: g.description,
            apiCount: g._count.apiSources,
            backendUrl: `${process.env.NEXT_PUBLIC_API_URL}/api/aggregate/${encodeURIComponent(g.name)}`
          }))   //backend url for each group
        );
      }
      setLoading(false);
    });
  }, []);

  //handlers
  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    toast('Copied to clipboard!' , { icon: <ThumbsUp /> });
  };

  const handleEdit = (groupId: string) => {
    router.push(`/groups/${groupId}`);
  };

  if (loading) {
    return <p className="flex text-center py-8 min-h-[75vh] items-center justify-center">Loading <span>  </span> <LoaderCircle width={18} height={18} /></p>;
  }

  //test logs
  console.log(groups);
  console.log(process.env.NEXT_PUBLIC_API_URL);

  if (groups.length === 0) {
    return <p className="text-center py-8 min-h-[75vh]">No groups available.</p>;
  }

  return (
    <div className="px-4 py-8">
      <h1 className="text-3xl font-semibold mb-6">Your API Groups</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map(group => (
          <div key={group.id} className="border border-black p-6 rounded-md flex flex-col justify-between">
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
                  className="border-black text-black hover:bg-black hover:text-white hover:cursor-pointer"
                  onClick={() => handleCopy(group.backendUrl)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className='mt-4 flex justify-between'>
                <Button variant="outline" size="sm" className="border-black bg-white text-black hover:bg-black hover:text-white hover:cursor-pointer" onClick={() => handleEdit(group.id)}>
                    Edit
                </Button>

                <Button variant="outline" size="sm" className="border-black bg-black text-white hover:bg-white hover:text-black hover:cursor-pointer">
                   <Zap className="w-4 h-4" /> Run
                </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

