'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

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

  const [auth, setAuth] = useState(false)

  useEffect(()=>{
    const token = localStorage.getItem('token')

    if(token){
      setAuth(true)
    }else{
      setAuth(false)
    }
  }, [])

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

            {/* //only so logouth when signed in */}
            {auth ?(
              <span className='border-b-[0.5px] border-red-950 text-sm text-red-950 hover:cursor-pointer hover:border-red-800 hover:text-red-800' onClick={()=>{
                localStorage.removeItem('token')
                sessionStorage.clear()
                window.location.href = '/'
              }}>sign out</span>
            ) : (
              <Link href="/">
                <span className='border-b-[0.5px] border-gray-900 text-sm'>Overview</span>
              </Link>
            )}

            {/* <Link href="/">
              <img src="/discord.svg" alt="" height={24} width={24} />
            </Link> */}

            <Link href="https://github.com/kartiktyagi2001/samik">
              <img src="/github.svg" alt="" height={21} width={21} />
            </Link>
          </div>
      </div>

          
    </nav>
  );
}