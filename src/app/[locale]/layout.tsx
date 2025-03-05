import { generateMetadata } from '@/lib/MetaData';
import '@/app/globals.css';
import { NextUIProviders } from './providers';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { SessionProvider } from 'next-auth/react';
import Header from '@/components/Header';
import FooterSection from '@/components/Footer';
import LiveChat from '@/components/ui/LiveChat';
import { Manrope } from 'next/font/google';
import ButtonFooter from '@/components/ui/ButtonFooter';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-manrope',
});

export { generateMetadata };

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
          <NextUIProviders>
            <SessionProvider>
              <Header />
              {children}
              <FooterSection />
            </SessionProvider>
            <ButtonFooter />
            <LiveChat />
          </NextUIProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
