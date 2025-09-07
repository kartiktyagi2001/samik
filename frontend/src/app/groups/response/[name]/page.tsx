'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { aggregationApi } from '@/lib/api';
import { AggregatedResponse } from '@/lib/types';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

type DataRow = Record<string, unknown>;

export default function AggregatePage() {
  const params = useParams();
  const raw = Array.isArray(params.name) ? params.name[0] : params.name || '';
  const groupName = decodeURIComponent(raw);
  const router = useRouter();

  const [data, setData] = useState<DataRow[]>([]);
  const [metadata, setMetadata] = useState<AggregatedResponse['metadata'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [runnig, setRunning] = useState(false);
  const [runAgain, setRunAgain] = useState(0);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL

  //test log
  console.log("hi")

  useEffect(() => {

    //test log
    console.log("useeffect starts")

    if (!groupName) {
      toast.error('No group specified');
      router.push('/groups');
      return;
    }

    //test log
    console.log("!group name passed")

    async function fetchAggregate() {
      setLoading(true);
      try {
        // const res = await aggregationApi.aggregateGroup(groupName);
        // if (res.success && res.data && Array.isArray(res.data)) {
        //   //test log
        //   console.log('success');

        //   setData(res.data as DataRow[]);

        //   //testlog
        //   console.log(data)

        //   //test log
        // //   console.log('State updated, data length:', res.data.data.length);

        //   setMetadata(res.metadata);


        //skipped the handler for this request, it was causing too many errors
        const raw = await fetch(`${API_BASE}/api/aggregate/${groupName}`);
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

            //testlog
            console.log("failed to recieve response")

          toast.error('Failed to fetch aggregated data');
          setData([]);
          setMetadata(null);
        }
      } catch (error) {

        //testlog
        console.log('some error')

        toast.error('Failed to fetch data, try again!');
        setData([]);
        setMetadata(null);

        // test alert
        alert(error)
      }
      setLoading(false);
    }
    fetchAggregate();

    //testlog
    console.log("aggregate function called")

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
            className="border-black text-black hover:bg-black hover:text-white"
            onClick={() => router.push('/groups')}
            >
            Back
            </Button>
        
            <Button
            variant="outline"
            className="border-black bg-black text-white hover:bg-black/80 hover:text-white"
            onClick={() => {
                setRunAgain(runAgain+1)
                toast.success("Fetching Response Again! Please Wait!")
            }}
            >
            Run Again
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
              <div className="overflow-auto border border-black rounded">
                <table className="min-w-full divide-y divide-black">
                  <thead className="bg-gray-100">
                    <tr>
                      {headers.map(header => (
                        <th
                          key={header}
                          className="px-4 py-2 text-left text-sm font-medium text-gray-700"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black">
                    {data.map((row, idx) => (
                      <tr key={idx} className="bg-white">
                        {headers.map(header => (
                          <td key={header} className="px-4 py-2 text-sm text-gray-800">
                            {String((row as DataRow)[header] ?? '')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {metadata && (
            <div>
                <h2 className="text-2xl font-medium mb-4">Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="border border-black p-4 rounded">
                    <h3 className="font-medium text-sm text-gray-600">Total APIs</h3>
                    <p className="text-xl font-bold">{metadata.totalAPIs}</p>
                </div>
                <div className="border border-black p-4 rounded">
                    <h3 className="font-medium text-sm text-gray-600">Successes</h3>
                    <p className="text-xl font-bold">{metadata.successfulAPIs}</p>
                </div>
                <div className="border border-black p-4 rounded">
                    <h3 className="font-medium text-sm text-gray-600">Failures</h3>
                    <p className="text-xl font-bold">{metadata.failedAPIs}</p>
                </div>
                <div className="border border-black p-4 rounded">
                    <h3 className="font-medium text-sm text-gray-600">Time (ms)</h3>
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
