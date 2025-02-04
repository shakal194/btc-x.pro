import HeroSection from '@/components/AirdropPage/Hero';
import AboutTokenSection from '@/components/AirdropPage/AboutTokenBTCXT';
import RatingSection from '@/components/AirdropPage/Rating';
import LaunchingToken from '@/components/AirdropPage/LaunchingToken';

export default function Home() {
  return (
    <main className='bg-black text-white'>
      <HeroSection />
      <AboutTokenSection />
      <RatingSection />
      <LaunchingToken />
    </main>
  );
}
