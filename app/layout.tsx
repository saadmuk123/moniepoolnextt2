
import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import { Toaster } from 'sonner';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | MoniepOOl Dashboard',
    default: 'MoniepOOl Dashboard',
  },
  description: 'The official Next.js Course Dashboard, built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};


import { Providers } from './providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          {children}
          <Toaster position="top-center" richColors />
        </Providers>
      </body>
    </html>
  );
}