import Header from '@/components/Header';
import ButtonFooter from '@/components/ui/ButtonFooter';
import FooterSection from '@/components/Footer';
import LiveChat from '@/components/ui/LiveChat';

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      {children}
      <ButtonFooter />
      <FooterSection />
      <LiveChat />
    </>
  );
}
