// app/layout.tsx - Root layout component

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DataForge - API Aggregation Platform',
  description: 'Unify multiple API calls into a single endpoint. Perfect for developers and analysts.',
  keywords: ['API', 'aggregation', 'data', 'developers', 'analytics'],
  authors: [{ name: 'DataForge Team' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}