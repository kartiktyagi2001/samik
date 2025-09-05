'use client';

import Link from 'next/link';

export function Footer() {
    return(
        <footer className='bg-gray-50 px-20 py-10'>
            <div>
                <Link href="https://kartiktyagi.vercel.app" target='_blank' className='text-sm text-gray-700'>
                <span>Kartik Tyagi</span>
                </Link>
            </div>
        </footer>
    )
}