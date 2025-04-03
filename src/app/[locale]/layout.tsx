import { generateMetadata } from '@/lib/MetaData';
import './globals.css';
import { NextUIProviders } from './providers';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { SessionProvider } from 'next-auth/react';
import { Manrope } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-manrope',
});

type Params = Promise<{ locale: string }>;

export { generateMetadata };

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Params;
}>) {
  const { locale } = await params;

  const messages = await getMessages({ locale });

  return (
    <html lang={locale} suppressHydrationWarning>
      <GoogleAnalytics gaId='AW-16949187745' />
      <body className={`overflow-x-hidden ${manrope.className}`}>
        <NextIntlClientProvider messages={messages}>
          <NextUIProviders>
            <SessionProvider>{children}</SessionProvider>
          </NextUIProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
