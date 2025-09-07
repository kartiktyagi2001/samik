'use client';

import React, { useEffect, useState } from 'react';
import { groupsApi, aggregationApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
// import { Progress } from '@/components/ui/progress';
import {toast} from 'sonner';
import { Copy, ThumbsUp, Zap, LoaderCircle, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';

//temp type for  info to be displayed
interface GroupInfo {
  id: string;
  name: string;
  description?: string;
  apiCount?: number;
  backendUrl: string;
}

export default function GroupsPage() {

  const router = useRouter();

  const [groups, setGroups] = useState<GroupInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [groupName, setGroupName] = useState('')
  const [groupDescription, setGroupDescription] = useState('')
  const [creating, setCreating] = useState(false)

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

  const handleRun = (groupName: string)=>{
    router.push(`/groups/response/${encodeURIComponent(groupName)}`)
  }

  //new group creation handler
  const handleCreateNew = async ()=>{
    if(!groupName){
      toast.error("Group Name Required!")
      return;
    }

    setCreating(true)

    let res;

    if(groupDescription){
      res = await groupsApi.create({
        name: groupName,
        description: groupDescription
      })
    } else{
      res = await groupsApi.create({
        name: groupName,
      })
    }
    setCreating(false)
    setShowCreateForm(!showCreateForm)

    if(res.success && res.data && groups){

      const newGroup = {
        id: res.data.id,
        name: res.data.name,
        description: res.data.description,
        // apiCount: res.data._count.apiSources, //this might cause vercel deploy runtime err
        apiCount: 0, //so i did this since it is always zeo fro now
        backendUrl: `${process.env.NEXT_PUBLIC_API_URL}/api/aggregate/${encodeURIComponent(res.data.name)}`
      }
      
      setGroups((prevGroups =>{
        return [...prevGroups, newGroup]
      }))

      toast.success("New Group Created!")
    } else{
      toast.error(res.error || "Failed to Create Group, please try again!")
    }
  }

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
    <div className="px-4 py-8 min-h-screen">

      <div className='flex justify-between items-center'>
        <h1 className="text-3xl font-semibold mb-6">Your API Groups</h1>
        <Button className='hover:bg-black/70 border-black' onClick={()=> setShowCreateForm(!showCreateForm)}>
          <Plus></Plus> New
        </Button>
      </div>

      {showCreateForm && (
        <div className="border border-black p-4 rounded mb-10">
          <h3 className="font-medium mb-3">Create New Group</h3>
          <div className="space-y-3">
            <Input
              placeholder="Group Name"
              value={groupName}
              onChange={e => setGroupName(e.target.value)}
              className="border-black"
            />
            <Input
              placeholder="Description"
              value={groupDescription}
              onChange={e => setGroupDescription(e.target.value)}
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
                onClick={() => {
                  setShowCreateForm(false);
                  setGroupName('');
                  setGroupDescription('');
                  handleCreateNew
                }}
                className="border-black hover:bg-black hover:text-white"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

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

                <Button variant="outline" size="sm" className="border-black bg-black text-white hover:bg-white hover:text-black hover:cursor-pointer" onClick={()=>handleRun(group.name)}>
                   <Zap className="w-4 h-4" /> Run
                </Button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

