import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/sonner';
// import { Provider } from "@/components/ui/provider"


const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  weight: ['100', '200', '300', '400', '500', '600' , '700']
});

export const metadata: Metadata = {
  title: 'DataForge - API Aggregation Platform',
  description: 'Unify multiple API calls into a single endpoint. Perfect for developers and analysts.',
  keywords: ['API', 'aggregation', 'data', 'developers', 'analytics', 'single endpoint', 'data integration', 'API management', 'data tools', 'data services', 'API integration', 'data aggregation', 'developer tools'],
  authors: [{ name: 'DataForge Team' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <div className="bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 min-h-[80vh]">
            {children}
            <Toaster />
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}