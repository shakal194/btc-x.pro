import HeroSection from '@/components/PageComponents/AboutUsPage/Hero';
import AboutUsSection from '@/components/PageComponents/AboutUsPage/AboutUs';
import OpportunitiesSection from '@/components/PageComponents/AboutUsPage/Opportunities';
import HowItWorksSection from '@/components/PageComponents/AboutUsPage/HowItWorks';

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
