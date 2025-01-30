import HeroSection from '@/components/MainPage/Hero';
import OurPlatformSection from '@/components/MainPage/OurPlatform';
import FeaturesSection from '@/components/MainPage/Features';
import PlatformStats from '@/components/MainPage/PlatformStats';
import SixSteps from '@/components/MainPage/SixSteps';
import AboutUs from '@/components/MainPage/AboutUs';
import FAQ from '@/components/MainPage/FAQ';

export default function Home() {
  return (
    <main className='bg-black text-white'>
      <HeroSection />
      <OurPlatformSection />
      <FeaturesSection />
      <PlatformStats />
      <SixSteps />
      <AboutUs />
      <FAQ />
    </main>
  );
}
