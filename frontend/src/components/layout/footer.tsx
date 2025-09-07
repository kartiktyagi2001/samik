'use client';

import Link from 'next/link';

export function Footer() {
    return(
        <footer className='bg-gray-50 px-20 py-10'>
            <div>
                
                <span className='text-sm text-gray-700'>Engineered by </span>

                <Link href="https://kartiktyagi.vercel.app" target='_blank' className='text-sm text-gray-700'>
                <span className='underline hover:
                transition-transform duration-200 hover:scale-102 text-black'>Kartik Tyagi</span>
                </Link>
            </div>
        </footer>
    )
}