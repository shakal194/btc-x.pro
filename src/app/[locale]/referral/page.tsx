import HeroSection from '@/components/PageComponents/RefferalPage/Hero';
import HowItWorksSection from '@/components/PageComponents/RefferalPage/HowItWorks';
import ForWhoSection from '@/components/PageComponents/RefferalPage/ForWho';
import HowWorksRefProgram from '@/components/PageComponents/RefferalPage/HowWorksRefProgram';
import OurBenefitsSection from '@/components/PageComponents/RefferalPage/OurBenefits';

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
