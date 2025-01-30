import type { Metadata } from 'next';
import './globals.css';
import { NextUIProviders } from './providers';
import Header from '@/components/Header';
import FooterSection from '@/components/Footer';
import { Manrope } from 'next/font/google';
import ButtonFooter from '@/components/ButtonFooter';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-manrope',
});

export const metadata: Metadata = {
  title: 'BTC-X.PRO',
  description: 'Криптовалютный сервис',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning className=''>
      <body className={`overflow-x-hidden ${manrope.className}`}>
        <Header />
        <NextUIProviders>{children}</NextUIProviders>
        <FooterSection />
        <ButtonFooter />
      </body>
    </html>
  );
}
