import HeroSection from '@/components/PageComponents/AirdropPage/Hero';
import AboutTokenSection from '@/components/PageComponents/AirdropPage/AboutTokenBTCXT';
import RatingSection from '@/components/PageComponents/AirdropPage/Rating';
import LaunchingTokenSection from '@/components/PageComponents/AirdropPage/LaunchingToken';

export default function Home() {
  return (
    <main className='bg-black text-white'>
      <HeroSection />
      <AboutTokenSection />
      <RatingSection />
      <LaunchingTokenSection />
    </main>
  );
}
