// 'use client';

// import { useState, useEffect } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { groupsApi } from '@/lib/api';
// import { ApiGroup, ApiSource } from '@/lib/types';
// import { toast } from 'sonner';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// // import { Progress } from '@/components/ui/progress';

// export default function GroupManagePage() {
// //   const { groupId } = useParams();
// //   const id = groupId as string;

//     const params = useParams();
//     const id = Array.isArray(params.groupId) ? params.groupId[0] : params.groupId || '';

//   const router = useRouter();

//   const [group, setGroup] = useState<ApiGroup | null>(null);
//   const [apis, setApis] = useState<ApiSource[]>([]);
//   const [loading, setLoading] = useState(true);

//   //add API form state
//   const [newApiName, setNewApiName] = useState('');
//   const [newApiUrl, setNewApiUrl] = useState('');
//   const [adding, setAdding] = useState(false);

//   useEffect(() => {
//     async function loadGroup() {
//       setLoading(true);
//       const res = await groupsApi.getById(id!);
//       if (res.success && res.data) {
//         setGroup(res.data);
//         setApis(res.data.apiSources);
//       } else {
//         toast.error(res.error || 'Failed to load group');
//       }
//       setLoading(false);
//     }
//     if (id) loadGroup();
//   }, [id]);

//   async function deleteGroup() {
//     if (!confirm('Are you sure you want to delete this group?')) return;
//     const res = await groupsApi.delete(id!);
//     if (res.success) {
//       toast.success('Group deleted');
//       router.push('/groups');
//     } else {
//       toast.error(res.error || 'Failed to delete group');
//     }
//   }

//   async function addApi() {
//     if (!newApiName || !newApiUrl) {
//       toast.error('API name and URL are required');
//       return;
//     }
//     setAdding(true);
//     const res = await groupsApi.addApi(id!, {
//       name: newApiName,
//       url: newApiUrl,
//       method: 'GET',
//       timeout: 30000,
//     });
//     setAdding(false);

//     if (res.success && res.data) {
//       setApis(prev => [...prev, res.data as ApiSource]);
//       setNewApiName('');
//       setNewApiUrl('');
//       toast.success('API added');
//     } else {
//       toast.error(res.error || 'Failed to add API');
//     }
//   }

//   async function removeApi(apiId: string) {
//     if (!confirm('Remove this API from the group?')) return;
//     const res = await groupsApi.removeApi(id!, apiId);
//     if (res.success) {
//       setApis(prev => prev.filter(a => a.id !== apiId));
//       toast.success('API removed');
//     } else {
//       toast.error(res.error || 'Failed to remove API');
//     }
//   }

//   if (loading) return <p className="p-4 flex justify-center items-center min-h-[75vh]">Loading...</p>;

//   return (
//     <div className="max-w-3xl mx-auto p-6 space-y-8">
//       <h1 className="text-3xl font-semibold">{group?.name}</h1>
//       <p className="text-gray-700">{group?.description || 'No description'}</p>

//       <section>
//         <h2 className="text-xl font-medium mb-4">APIs ({apis.length})</h2>
//         {apis.length === 0 && <p>No APIs added yet.</p>}
//         <ul className="space-y-3">
//           {apis.map(api => (
//             <li
//               key={api.id}
//               className="flex justify-between items-center border border-black p-3 rounded"
//             >
//               <div>
//                 <p className="font-medium">{api.name}</p>
//                 <code className="text-xs">{api.url}</code>
//               </div>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 className="border-black text-black hover:bg-black hover:text-white"
//                 onClick={() => removeApi(api.id)}
//               >
//                 Remove
//               </Button>
//             </li>
//           ))}
//         </ul>
//       </section>

//       <section>
//         <h2 className="text-xl font-medium mb-4">Add New API</h2>
//         <div className="flex space-x-3">
//           <Input
//             placeholder="API Name"
//             value={newApiName}
//             onChange={e => setNewApiName(e.target.value)}
//           />
//           <Input
//             placeholder="API URL"
//             value={newApiUrl}
//             onChange={e => setNewApiUrl(e.target.value)}
//           />
//           <Button
//             onClick={addApi}
//             disabled={adding}
//             className="bg-black text-white hover:bg-black/90"
//           >
//             Add
//           </Button>
//         </div>
//       </section>

//       <div className="pt-8 border-t border-black flex justify-between">
//         <Button
//           variant="outline"
//           className="border-black text-black hover:bg-black hover:text-white"
//           onClick={() => router.push('/groups')}
//         >
//           Back to Groups
//         </Button>
//         <Button
//           className="bg-red-600 text-white hover:bg-red-700"
//           onClick={deleteGroup}
//         >
//           Delete Group
//         </Button>
//       </div>
//     </div>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { groupsApi } from '@/lib/api';
import { ApiGroup, ApiSource } from '@/lib/types';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function GroupManagePage() {
  const params = useParams();
  const id = Array.isArray(params.groupId) ? params.groupId[0] : params.groupId || '';

  const router = useRouter();

  const [group, setGroup] = useState<ApiGroup | null>(null);
  const [apis, setApis] = useState<ApiSource[]>([]);
  const [loading, setLoading] = useState(true);

  //add API form state
  const [newApiName, setNewApiName] = useState('');
  const [newApiUrl, setNewApiUrl] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);  // No ID, no loading needed
      return;
    }
    async function loadGroup() {
      setLoading(true);
      try {
        const res = await groupsApi.getById(id);
        if (res.success && res.data) {
          setGroup(res.data);
          setApis(res.data.apiSources);
        } else {
          toast.error(res.error || 'Failed to load group');
        }
      } catch {
        toast.error('Failed to load group');
      } finally {
        setLoading(false);
      }
    }
    loadGroup();
  }, [id]);

  async function deleteGroup() {
    if (!confirm('Are you sure you want to delete this group?')) return;
    const res = await groupsApi.delete(id);
    if (res.success) {
      toast.success('Group deleted');
      router.push('/groups');
    } else {
      toast.error(res.error || 'Failed to delete group');
    }
  }

  async function addApi() {
    if (!newApiName || !newApiUrl) {
      toast.error('API name and URL are required');
      return;
    }
    setAdding(true);
    const res = await groupsApi.addApi(id, {
      name: newApiName,
      url: newApiUrl,
      method: 'GET',
      timeout: 30000,
    });
    setAdding(false);

    if (res.success && res.data) {
      setApis(prev => [...prev, res.data as ApiSource]);
      setNewApiName('');
      setNewApiUrl('');
      toast.success('API added');
    } else {
      toast.error(res.error || 'Failed to add API');
    }
  }

  async function removeApi(apiId: string) {
    if (!confirm('Remove this API from the group?')) return;
    const res = await groupsApi.removeApi(id, apiId);
    if (res.success) {
      setApis(prev => prev.filter(a => a.id !== apiId));
      toast.success('API removed');
    } else {
      toast.error(res.error || 'Failed to remove API');
    }
  }

  if (loading) return <p className="p-4 flex justify-center items-center min-h-[75vh]">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-semibold">{group?.name}</h1>
      <p className="text-gray-700">{group?.description || 'No description'}</p>

      <section>
        <h2 className="text-xl font-medium mb-4">APIs ({apis.length})</h2>
        {apis.length === 0 && <p>No APIs added yet.</p>}
        <ul className="space-y-3">
          {apis.map(api => (
            <li
              key={api.id}
              className="flex justify-between items-center border border-black p-3 rounded"
            >
              <div>
                <p className="font-medium">{api.name}</p>
                <code className="text-xs">{api.url}</code>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-black text-black hover:bg-black hover:text-white"
                onClick={() => removeApi(api.id)}
              >
                Remove
              </Button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-medium mb-4">Add New API</h2>
        <div className="flex space-x-3">
          <Input
            placeholder="API Name"
            value={newApiName}
            onChange={e => setNewApiName(e.target.value)}
          />
          <Input
            placeholder="API URL"
            value={newApiUrl}
            onChange={e => setNewApiUrl(e.target.value)}
          />
          <Button
            onClick={addApi}
            disabled={adding}
            className="bg-black text-white hover:bg-black/90"
          >
            Add
          </Button>
        </div>
      </section>

      <div className="pt-8 border-t border-black flex justify-between">
        <Button
          variant="outline"
          className="border-black text-black hover:bg-black hover:text-white"
          onClick={() => router.push('/groups')}
        >
          Back to Groups
        </Button>
        <Button
          className="bg-red-600 text-white hover:bg-red-700"
          onClick={deleteGroup}
        >
          Delete Group
        </Button>
      </div>
    </div>
  );
}

