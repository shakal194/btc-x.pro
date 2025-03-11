import HeroSection from '@/components/PageComponents/CloudMiningPage/Hero';
import HowItWorksSection from '@/components/PageComponents/CloudMiningPage/HowItWorks';
import ForWhoSection from '@/components/PageComponents/CloudMiningPage/ForWho';
import HowWorksCloudMining from '@/components/PageComponents/CloudMiningPage/HowWorksCloudMining';
import OurBenefitsSection from '@/components/PageComponents/CloudMiningPage/OurBenefits';

export default function Home() {
  return (
    <main className='bg-black text-white'>
      <HeroSection />
      <HowItWorksSection />
      <ForWhoSection />
      <HowWorksCloudMining />
      <OurBenefitsSection />
    </main>
  );
}
