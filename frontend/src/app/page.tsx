'use client';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { formatNumber } from '@/lib/utils';
import { Plus, Database, Zap, FileText } from 'lucide-react';
import { HeroSection } from '@/components/hero';
import { useEffect, useState } from 'react';


//Server Component - fetches data at build/request time, to be moved to other server logic file
// async function getDashboardStats() {
//   try {
//     const [groupsResponse, aggregationResponse] = await Promise.all([
//       api.groups.getAll(),
//       api.aggregation.listGroups()
//     ]);

//     const totalGroups = groupsResponse.success ? groupsResponse.data?.length || 0 : 0;
//     const totalApis = groupsResponse.success 
//       ? groupsResponse.data?.reduce((sum, group) => sum + group._count.apiSources, 0) || 0 
//       : 0;
//     const availableEndpoints = aggregationResponse.success ? aggregationResponse.data?.length || 0 : 0;

//     return {
//       totalGroups,
//       totalApis,
//       availableEndpoints,
//       recentGroups: groupsResponse.success ? groupsResponse.data?.slice(0, 3) || [] : []
//     };
//   } catch (error) {
//     //Handle error
//     return {
//       totalGroups: 0,
//       totalApis: 0,
//       availableEndpoints: 0,
//       recentGroups: []
//     };
//   }
// }

export default function HomePage() {
  // const stats = await getDashboardStats();  //not using rn

  const [user, setUser] = useState(false)

  useEffect(()=>{
    if(localStorage.getItem('token')){
      setUser(true)
    }else{
      setUser(false)
    }
  }, [user])

  return (
    <div className='flex flex-col justify-center items-center'>
      <HeroSection user={user} />

      <div>

      </div>
    </div>
  );
}