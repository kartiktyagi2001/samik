'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="flex items-center justify-start bg-gray-50 px-4 py-10">
      <div className="max-w-6xl mx-auto text-center">

        <div className="space-y-4 mb-8">
          <h1 className="text-7xl sm:text-7xl md:text-7xl lg:text-8xl font-normal leading-tight">

            <span className="text-gray-900">Unified </span>
            <span className="bg-gradient-to-r from-green-400 via-teal-400 to-blue-500 bg-clip-text text-transparent">
              APIs
            </span>

          </h1>
        </div>

        <div className="max-w-4xl mx-auto mb-12">
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 font-normal leading-relaxed">
            Your data integration layer, bringing multiple APIs together, standardized into one reliable endpoint
          </p>
        </div>

        <div className="flex flex-col gap-2 justify-center">
          <span>
            <Link href="/groups">
              <Button 
                size="lg"
                className="bg-black hover:bg-black/80 hover:cursor-pointer text-white px-8 py-6 rounded-lg text-base sm:text-lg font-medium transition-colors duration-100 click:bg-black/80 click:scale-95 click:duration-75"
              >
                Create Group
              </Button>
            </Link>
          </span>

          <span>
            <Link href="/test">
              <span className='text-black/90 text-sm underline underline-offset-1'>test an API endpoint</span>
            </Link>
        </span>
        </div>
      </div>
    </section>
  );
}