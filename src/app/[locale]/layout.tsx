import type { Metadata } from 'next';
import './globals.css';
import { NextUIProviders } from './providers';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
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
  icons: {
    icon: '/favicon.png',
  },
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const { locale } = await params;

  const messages = await getMessages({ locale });

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`overflow-x-hidden ${manrope.className}`}>
        <NextIntlClientProvider messages={messages}>
          <Header locale={locale} />
          <NextUIProviders>{children}</NextUIProviders>
          <FooterSection locale={locale} />
          <ButtonFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
