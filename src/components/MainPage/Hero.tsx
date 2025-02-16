import HeroMainPage from '@/components/ui/MainPageHeroComponentLocalized';

export default function HeroSection() {
  return (
    <section className='bg-black py-[25px] lg:py-[100px]'>
      <div className='container relative mx-auto px-4'>
        <HeroMainPage />
      </div>
    </section>
  );
}
