'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Zap } from 'lucide-react';

// const navigation = [
//   {
//     name: 'Dashboard',
//     href: '/',
//     icon: Home
//   },
//   {
//     name: 'Groups',
//     href: '/groups',
//     icon: Database
//   },
//   {
//     name: 'API Tester',
//     href: '/test',
//     icon: Zap
//   }
// ];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-50">
      <div className="flex justify-between items-center text-center py-6 px-5">
        {/* logo and title */}
          <Link href="/" className="flex items-center space-x-0">
            <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-black" />
            </div>
            <span className="text-2xl font-[500] text-gray-900">DataForge</span>
          </Link>

          {/* navigation */}
          <div className='flex gap-4 items-center justify-between'>
            <Link href="/">
            <span className='border-b-[0.5px] border-gray-900 text-sm'>Overview</span>
          </Link>

          <Link href="/">
              <img src="/discord.svg" alt="" height={24} width={24} />
            </Link>

            <Link href="/">
              <img src="/github.svg" alt="" height={21} width={21} />
            </Link>
          </div>
      </div>

          
    </nav>
  );
}