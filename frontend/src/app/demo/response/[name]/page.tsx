'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AggregatedResponse } from '@/lib/types';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { copyToClipboard, downloadData } from '@/lib/dataUtils';
import { Copy, Download, ChevronLeft, Zap} from 'lucide-react';


type DataRow = Record<string, unknown>;

export default function AggregatePage() {
  const params = useParams();
  const raw = Array.isArray(params.name) ? params.name[0] : params.name || '';
  const groupName = decodeURIComponent(raw);
  const router = useRouter();

  const [data, setData] = useState<DataRow[]>([]);
  const [metadata, setMetadata] = useState<AggregatedResponse['metadata'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [runAgain, setRunAgain] = useState(0);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {

    if (!groupName) {
      toast.error('No group specified');
      router.push('/groups');
      return;
    }
    async function fetchAggregate() {
      setLoading(true);
      try {
       
        const raw = await fetch(`${API_BASE}/demo/aggregate/${groupName}`);
        const json: {
        success: boolean;
        data: DataRow[];
        metadata: AggregatedResponse['metadata'];
        error?: string;
        } = await raw.json();

        if (json.success) {
        setData(json.data);
        setMetadata(json.metadata);
        } else{

          toast.error('Failed to fetch aggregated data');
          setData([]);
          setMetadata(null);
        }
      } catch (error) {


        toast.error('Failed to fetch data, try again!');
        setData([]);
        setMetadata(null);
      }
      setLoading(false);
    }
    fetchAggregate();

  }, [groupName, router, runAgain]);

  //headers derivation- check data is non-empty array
  const headers = Array.isArray(data) && data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">{groupName}</h1>
        <div className='flex justify-between gap-4'>
            <Button
            variant="outline"
            className="border-black hover:bg-black hover:text-white"
            onClick={() => router.back()}
            >
            <ChevronLeft />
            </Button>
        
            <Button
            variant="outline"
            className="border-black bg-black dark:bg-black text-white hover:bg-black/80 dark:hover:bg-zinc-950 hover:text-white"
            onClick={() => {
                setRunAgain(runAgain+1)
                toast.success("Fetching Response Again! Please Wait!")
            }}
            >
            <Zap className="w-4 h-4" /> Again
            </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-center py-20">Loading…</p>
      ) : (
        <>
          
          <section>
            <h2 className="text-2xl font-medium mb-4">Data</h2>
            {!Array.isArray(data) || data.length === 0 ? (
              <p className="text-gray-600">No data returned.</p>
            ) : (

            <div>
                <div className="overflow-auto border border-black dark:border-zinc-800 rounded">
                    <table className="min-w-full divide-y divide-black dark:divide-white">
                    <thead className="bg-zinc-100 dark:bg-zinc-900">
                        <tr>
                        {headers.map(header => (
                            <th
                            key={header}
                            className="px-4 py-2 text-left text-sm font-medium text-zinc-700 dark:text-zinc-300"
                            >
                            {header}
                            </th>
                        ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-black dark:divide-white">
                        {data.map((row, idx) => (
                        <tr key={idx} className="bg-white dark:bg-zinc-900">
                            {headers.map(header => (
                            <td key={header} className="px-4 py-2 text-sm text-zinc-800 dark:text-zinc-200">
                                {String((row as DataRow)[header] ?? '')}
                            </td>
                            ))}
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>

                <div className="flex justify-between gap-2 mt-4">

                    <div className='flex gap-2'>
                        <Button
                        size="sm"
                        variant="outline"
                        className="border-black dark:border-zinc-800 text-black dark:text-white hover:bg-black hover:text-white hidden sm:flex"
                        onClick={() => copyToClipboard(data, 'json')}
                        >
                        <Copy /> JSON
                        </Button>
                        
                        <Button
                        size="sm"
                        variant="outline"
                        className="border-black dark:border-zinc-800 text-black dark:text-white hover:bg-black hover:text-white"
                        onClick={() => copyToClipboard(data, 'csv')}
                        >
                        <Copy /> <span className='hidden sm:flex'>CSV</span>
                        </Button>
                    </div>
                    
                    <div className='flex gap-2'>
                        <Button
                        variant="outline"
                        size="sm"
                        className="border-black dark:border-zinc-800 text-black dark:text-white hover:bg-black hover:text-white text-sm hidden sm:flex"
                        onClick={() => downloadData(data, 'json', groupName)}
                        >
                        <Download /> JSON
                        </Button>
                        
                        <Button
                        variant="outline"
                        size="sm"
                        className="border-black dark:border-zinc-800 text-black dark:text-white hover:bg-black hover:text-white"
                        onClick={() => downloadData(data, 'csv', groupName)}
                        >
                        <Download /> <span className='hidden sm:flex'>CSV</span>
                        </Button>
                    </div>
                </div>
            </div>

              
            )}
          </section>

          {metadata && (
            <div>
                <h2 className="text-2xl font-medium mb-4">Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="border border-black dark:border-zinc-800 p-4 rounded">
                    <h3 className="font-medium text-sm text-gray-600 dark:text-gray-400">Total APIs</h3>
                    <p className="text-xl font-bold">{metadata.totalAPIs}</p>
                </div>
                <div className="border border-black dark:border-zinc-800 p-4 rounded">
                    <h3 className="font-medium text-sm text-gray-600 dark:text-gray-400">Successes</h3>
                    <p className="text-xl font-bold">{metadata.successfulAPIs}</p>
                </div>
                <div className="border border-black dark:border-zinc-800 p-4 rounded">
                    <h3 className="font-medium text-sm text-gray-600 dark:text-gray-400">Failures</h3>
                    <p className="text-xl font-bold">{metadata.failedAPIs}</p>
                </div>
                <div className="border border-black dark:border-zinc-800 p-4 rounded">
                    <h3 className="font-medium text-sm text-gray-600 dark:text-gray-400">Time (ms)</h3>
                    <p className="text-xl font-bold">{metadata.responseTime}</p>
                </div>
                </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
