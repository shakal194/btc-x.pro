import type { Metadata } from 'next';
import './globals.css';
import { NextUIProviders } from './providers';
import Header from '@/components/Header';
import FooterSection from '@/components/Footer';
import { Manrope } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';

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
    <html lang='en' suppressHydrationWarning>
      <body className={manrope.className}>
        <Header />
        <NextUIProviders>{children}</NextUIProviders>
        <FooterSection />
        <Link
          href='https://onelink.to/js2s8h'
          target='_blank'
          rel='noopener noreferrer'
          className='group sticky bottom-0 left-1/2 flex h-[72px] w-[354px] -translate-x-1/2 items-center justify-evenly rounded-full bg-[#1F1F1F]'
        >
          <Image
            src='/Logo.png'
            alt='Logo'
            width={30}
            height={45}
            className='h-[45px] w-[30px]'
          />
          <p className='text-[30px] font-semibold leading-[120%] text-white group-hover:text-[#FD6B06]'>
            BTC-X
          </p>

          <p className='rounded-full bg-[#FE9900] px-5 py-3 text-primary font-semibold leading-[120%] text-black transition group-hover:bg-[#FD6B06] group-hover:text-white group-focus:bg-[#FD6B06] group-focus:text-white'>
            Приєднуйся
          </p>
        </Link>
      </body>
    </html>
  );
}
