import HeroSection from '@/components/RefferalPage/Hero';
import HowItWorksSection from '@/components/RefferalPage/HowItWorks';
import ForWhoSection from '@/components/RefferalPage/ForWho';
import HowWorksRefProgram from '@/components/RefferalPage/HowWorksRefProgram';
import OurBenefitsSection from '@/components/RefferalPage/OurBenefits';

export default function Home() {
  return (
    <main className='bg-black text-white'>
      {/* Hero Section */}
      <HeroSection />
      <HowItWorksSection />
      <ForWhoSection />
      <HowWorksRefProgram />
      <OurBenefitsSection />
    </main>
  );
}
