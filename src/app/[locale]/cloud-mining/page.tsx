import HeroSection from '@/components/PageComponents/CloudMiningPage/Hero';
import HowItWorksSection from '@/components/PageComponents/CloudMiningPage/HowItWorks';
import ForWhoSection from '@/components/PageComponents/CloudMiningPage/ForWho';
import HowWorksRefProgram from '@/components/PageComponents/CloudMiningPage/HowWorksRefProgram';
import OurBenefitsSection from '@/components/PageComponents/CloudMiningPage/OurBenefits';

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
