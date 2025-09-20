'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useHealthStatus } from '@/lib/health';
import { format } from 'date-fns';


export function Footer() {
  const ok = useHealthStatus();
  const date = new Date();

  return (
    <footer className='bg-gray-50 px-4 py-2'>
      <div className='flex  gap-3 justify-between items-center'>
        <div>
          <span className='text-gray-700 text-xs'>Engineered by </span>
          <Link href="https://kartiktyagi.vercel.app" target='_blank' className='text-sm text-gray-700'>
            <span className='underline hover:transition-transform duration-200 hover:scale-102 text-black text-xs'>
              Kartik Tyagi
            </span>
          </Link>
        </div>
        <div className='flex gap-2 items-center justify-center'>

          {/* <span className='text-gray-700 text-sm'>&copy;</span>

          <span className='text-gray-700 text-xs'>|</span> */}

          <span className='text-gray-700 text-xs'>
                {format(date, 'MMM d, yyyy')}
            </span>

            <span className='text-gray-700 text-xs'>|</span>

            <span className="relative flex h-3 w-3">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                ok ? 'bg-green-400' : 'bg-red-400'
                }`}></span>
                <span className={`relative inline-flex h-3 w-3 rounded-full ${
                ok ? 'bg-green-500' : 'bg-red-500'
                }`}></span>
            </span>
        </div>
      </div>
    </footer>
  );
}
