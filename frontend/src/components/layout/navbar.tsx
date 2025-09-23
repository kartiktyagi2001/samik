'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ThemeToggle } from '../themeToggle';

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
    <nav className="sticky top-0 left-0 w-full z-50 h-16 mb-10">
      <div className="flex justify-between items-center text-center py-6 px-5">
        {/* logo and title */}
          <Link href="/" className="flex items-center space-x-0">
            <div className="w-8 h-8 bg-transparent rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-black dark:text-gray-100" />
            </div>
            <span className="text-2xl font-[500] text-gray-900 dark:text-gray-100">Samik</span>
          </Link>

          {/* navigation */}
          <div className='flex gap-4 items-center justify-between'>

            {/* //only show logouth when signed in */}
            {auth ?(
              <span className='border-b-[0.5px] border-red-950 dark:border-red-800 text-sm text-red-950 dark:text-red-800 hover:cursor-pointer hover:border-red-800 dark:hover:border-red-500 hover:text-red-600 dark:hover:text-red-600' onClick={()=>{
                localStorage.removeItem('token')
                sessionStorage.clear()
                window.location.href = '/'
              }}>sign out</span>
            ) : (
              <Link href="/">
                <span className='border-b-[0.5px] border-gray-900 dark:border-gray-100 dark:text-gray-100 text-sm'>Overview</span>
              </Link>
            )}

            {/* <Link href="/">
              <img src="/discord.svg" alt="" height={24} width={24} />
            </Link> */}

              <ThemeToggle />

            <Link href="https://github.com/kartiktyagi2001/samik">
              <img src="/github.svg" className='rounded-full bg-zinc-100 dark:bg-zinc-950 p-[2.5px] w-7 h-7' alt="" height={22} width={22} />
            </Link>
          </div>
      </div>

          
    </nav>
  );
}