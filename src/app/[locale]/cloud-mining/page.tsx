import HeroSection from '@/components/CloudMiningPage/Hero';
import HowItWorksSection from '@/components/CloudMiningPage/HowItWorks';
import ForWhoSection from '@/components/CloudMiningPage/ForWho';
import HowWorksRefProgram from '@/components/CloudMiningPage/HowWorksRefProgram';
import OurBenefitsSection from '@/components/CloudMiningPage/OurBenefits';

export default function Home() {
  return (
    <main className='bg-black text-white'>
      <HeroSection />
      <HowItWorksSection />
      <ForWhoSection />
      <HowWorksRefProgram />
      <OurBenefitsSection />
    </main>
  );
}
