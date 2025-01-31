import HeroSection from '@/components/AboutUsPage/Hero';
import AboutUsSection from '@/components/AboutUsPage/AboutUs';
import OpportunitiesSection from '@/components/AboutUsPage/Opportunities';
import HowItWorksSection from '@/components/AboutUsPage/HowItWorks';

export default function Home() {
  return (
    <main className='bg-black text-white'>
      <HeroSection />
      <AboutUsSection />
      <OpportunitiesSection />
      <HowItWorksSection />
    </main>
  );
}
