import { getMessages } from 'next-intl/server';
import Header from '@/components/Header';
import ButtonFooter from '@/components/ui/ButtonFooter';
import FooterSection from '@/components/Footer';
import HeroSection from '@/components/PageComponents/MainPage/Hero';
import OurPlatformSection from '@/components/PageComponents/MainPage/OurPlatform';
import FeaturesSection from '@/components/PageComponents/MainPage/Features';
import PlatformStats from '@/components/PageComponents/MainPage/PlatformStats';
import SixSteps from '@/components/PageComponents/MainPage/SixSteps';
import AboutUs from '@/components/PageComponents/MainPage/AboutUs';
import FAQ from '@/components/PageComponents/MainPage/FAQ';

type Params = Promise<{ locale: string }>;

export default async function Home({ params }: { params: Params }) {
  const { locale } = await params;

  const messages = await getMessages({ locale });

  return (
    <>
      <Header />
      <main className='bg-black text-white'>
        <HeroSection />
        <OurPlatformSection />
        <FeaturesSection />
        <PlatformStats />
        <SixSteps />
        <AboutUs />
        <FAQ />
      </main>
      <ButtonFooter />
      <FooterSection />
    </>
  );
}
