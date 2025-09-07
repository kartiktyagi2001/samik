'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useHealthStatus } from '@/lib/health';


export function Footer() {
  const ok = useHealthStatus();

  return (
    <footer className='bg-gray-50 px-20 py-10'>
      <div className='flex justify-between items-center'>
        <div>
          <span className='text-sm text-gray-700'>Engineered by </span>
          <Link href="https://kartiktyagi.vercel.app" target='_blank' className='text-sm text-gray-700'>
            <span className='underline hover:transition-transform duration-200 hover:scale-102 text-black'>
              Kartik Tyagi
            </span>
          </Link>
        </div>
        <div>
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
