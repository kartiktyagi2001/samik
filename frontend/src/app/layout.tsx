import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from "next-themes";
// import { Provider } from "@/components/ui/provider"


const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  weight: ['100', '200', '300', '400', '500', '600' , '700']
});

export const metadata: Metadata = {
  title: 'Samik - API Aggregation Platform',
  description: 'Unify multiple APIs under a Group - one request, one response. Engineered for developers and analysts.',
  keywords: ['API', 'aggregation', 'data', 'developers', 'analytics', 'single endpoint', 'data integration', 'API management', 'data tools', 'data services', 'API integration', 'data aggregation', 'developer tools'],
  authors: [{ name: 'Kartik Tyagi' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={poppins.className}>
         <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="theme" disableTransitionOnChange>
          <div className='absolute inset-0 z-0'>
            <div className="min-h-screen w-full bg-gray-50 dark:bg-black dark:bg-[radial-gradient(ellipse_50%_100%_at_10%_0%,_rgba(226,232,240,0.15),transparent_65%)] relative overflow-hidden">
            
              <div className="relative z-10">
              
                  <Navbar />
                  <main className="container mx-auto px-4 min-h-[80vh]">
                    {children}
                    <Toaster />
                  </main>
                  <Footer />
                
              </div>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

        <div

            className=""

            style={{

              background: "",

            }}

          />