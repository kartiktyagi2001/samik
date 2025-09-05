// // app/page.tsx - Dashboard homepage

// import Link from 'next/link';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { api } from '@/lib/api';
// import { formatNumber } from '@/lib/utils';
// import { Plus, Database, Zap, FileText } from 'lucide-react';

// // Server Component - fetches data at build/request time
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
//     // Handle error gracefully in production
//     return {
//       totalGroups: 0,
//       totalApis: 0,
//       availableEndpoints: 0,
//       recentGroups: []
//     };
//   }
// }

// export default async function HomePage() {
//   const stats = await getDashboardStats();

//   return (
//     <div className="space-y-8">
//       {/* Hero Section */}
//       <div className="text-center space-y-4">
//         <h1 className="text-4xl font-bold text-gray-900">
//           Welcome to DataForge
//         </h1>
//         <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//           Unify multiple API calls into a single endpoint. Perfect for developers and data analysts 
//           who need clean, normalized data from multiple sources.
//         </p>
//         <div className="flex gap-4 justify-center">
//           <Link href="/groups/create">
//             <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
//               <Plus className="w-4 h-4 mr-2" />
//               Create First Group
//             </Button>
//           </Link>
//           <Link href="/test">
//             <Button variant="outline" size="lg">
//               <Zap className="w-4 h-4 mr-2" />
//               Test API
//             </Button>
//           </Link>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total Groups</CardTitle>
//             <Database className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{formatNumber(stats.totalGroups)}</div>
//             <p className="text-xs text-muted-foreground">
//               API groups created
//             </p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Active APIs</CardTitle>
//             <Zap className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{formatNumber(stats.totalApis)}</div>
//             <p className="text-xs text-muted-foreground">
//               APIs configured across all groups
//             </p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Available Endpoints</CardTitle>
//             <FileText className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{formatNumber(stats.availableEndpoints)}</div>
//             <p className="text-xs text-muted-foreground">
//               Ready for aggregation
//             </p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Quick Actions */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Recent Groups */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Recent Groups</CardTitle>
//             <CardDescription>Your most recently created API groups</CardDescription>
//           </CardHeader>
//           <CardContent>
//             {stats.recentGroups.length > 0 ? (
//               <div className="space-y-3">
//                 {stats.recentGroups.map((group) => (
//                   <div key={group.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                     <div>
//                       <h4 className="font-medium text-gray-900">{group.name}</h4>
//                       <p className="text-sm text-gray-600">
//                         {group._count.apiSources} API{group._count.apiSources !== 1 ? 's' : ''}
//                       </p>
//                     </div>
//                     <Link href={`/groups/${group.id}`}>
//                       <Button variant="outline" size="sm">
//                         View
//                       </Button>
//                     </Link>
//                   </div>
//                 ))}
//                 <Link href="/groups" className="block">
//                   <Button variant="ghost" className="w-full">
//                     View All Groups
//                   </Button>
//                 </Link>
//               </div>
//             ) : (
//               <div className="text-center py-8">
//                 <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                 <p className="text-gray-600 mb-4">No groups created yet</p>
//                 <Link href="/groups/create">
//                   <Button>Create Your First Group</Button>
//                 </Link>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* Quick Start Guide */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Quick Start</CardTitle>
//             <CardDescription>Get started with DataForge in 3 simple steps</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               <div className="flex items-start space-x-3">
//                 <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
//                   1
//                 </div>
//                 <div>
//                   <h4 className="font-medium text-gray-900">Create a Group</h4>
//                   <p className="text-sm text-gray-600">
//                     Group related APIs together for easier management
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-start space-x-3">
//                 <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
//                   2
//                 </div>
//                 <div>
//                   <h4 className="font-medium text-gray-900">Add APIs</h4>
//                   <p className="text-sm text-gray-600">
//                     Test and add your API endpoints to the group
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-start space-x-3">
//                 <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
//                   3
//                 </div>
//                 <div>
//                   <h4 className="font-medium text-gray-900">Get Unified Data</h4>
//                   <p className="text-sm text-gray-600">
//                     Call one endpoint to get normalized data from all APIs
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Features Overview */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Why DataForge?</CardTitle>
//           <CardDescription>Built for developers and data analysts who value efficiency</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             <div className="text-center">
//               <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
//                 <Zap className="w-6 h-6" />
//               </div>
//               <h4 className="font-medium text-gray-900 mb-2">Fast Aggregation</h4>
//               <p className="text-sm text-gray-600">
//                 Parallel API calls with intelligent error handling
//               </p>
//             </div>
//             <div className="text-center">
//               <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
//                 <Database className="w-6 h-6" />
//               </div>
//               <h4 className="font-medium text-gray-900 mb-2">Data Normalization</h4>
//               <p className="text-sm text-gray-600">
//                 Automatically merge and normalize different API responses
//               </p>
//             </div>
//             <div className="text-center">
//               <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3">
//                 <FileText className="w-6 h-6" />
//               </div>
//               <h4 className="font-medium text-gray-900 mb-2">Multiple Formats</h4>
//               <p className="text-sm text-gray-600">
//                 Get data as JSON or export to CSV for analysis
//               </p>
//             </div>
//             <div className="text-center">
//               <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center mx-auto mb-3">
//                 <Plus className="w-6 h-6" />
//               </div>
//               <h4 className="font-medium text-gray-900 mb-2">Easy Integration</h4>
//               <p className="text-sm text-gray-600">
//                 Simple REST API that fits into any tech stack
//               </p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }



// app/page.tsx - Dashboard homepage

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { formatNumber } from '@/lib/utils';
import { Plus, Database, Zap, FileText } from 'lucide-react';
import { HeroSection } from '@/components/hero';

// Server Component - fetches data at build/request time
async function getDashboardStats() {
  try {
    const [groupsResponse, aggregationResponse] = await Promise.all([
      api.groups.getAll(),
      api.aggregation.listGroups()
    ]);

    const totalGroups = groupsResponse.success ? groupsResponse.data?.length || 0 : 0;
    const totalApis = groupsResponse.success 
      ? groupsResponse.data?.reduce((sum, group) => sum + group._count.apiSources, 0) || 0 
      : 0;
    const availableEndpoints = aggregationResponse.success ? aggregationResponse.data?.length || 0 : 0;

    return {
      totalGroups,
      totalApis,
      availableEndpoints,
      recentGroups: groupsResponse.success ? groupsResponse.data?.slice(0, 3) || [] : []
    };
  } catch (error) {
    // Handle error gracefully in production
    return {
      totalGroups: 0,
      totalApis: 0,
      availableEndpoints: 0,
      recentGroups: []
    };
  }
}

export default async function HomePage() {
  const stats = await getDashboardStats();

  return (
    <div className='min-h-screen flex flex-col justify-center items-center'>
      <HeroSection />
    </div>
  );
}