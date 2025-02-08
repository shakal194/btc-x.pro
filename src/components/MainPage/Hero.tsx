import Image from 'next/image';
import { useTranslations } from 'next-intl';
import StoreButtons from '@/components/ui/StoreButtons';

export default function HeroSection() {
  const t = useTranslations('mainPage.hero');

  return (
    <section className='bg-black py-[25px] lg:py-[100px]'>
      <div className='container relative mx-auto px-4'>
        <div className='gap-2 lg:flex'>
          <div className='relative z-50'>
            <div className='lg:w-[650px]'>
              <h1 className='text-font30Leading110 md:text-font50Leading110 lg:text-font70Leading110'>
                {t('title')}{' '}
                <span className='bg-gradient-to-r from-[#FFC996] via-[#FD6B06] to-[#963706] bg-clip-text text-transparent'>
                  {t('subtitle')}
                </span>
              </h1>
            </div>
            <div className='mt-[20px] lg:mt-[186px] lg:w-[435px] lg:rounded-lg lg:bg-gradient-to-r lg:from-[#553300] lg:to-[#FE9900] lg:p-[1px]'>
              <div className='lg:bg-black lg:px-[25px] lg:py-6 xl:rounded-lg'>
                <p className='my-[25px] text-[13px] font-medium leading-[130%] opacity-[30%] md:text-font16Leading110 lg:mt-0 lg:max-w-3xl lg:text-primary lg:font-semibold lg:opacity-100'>
                  {t('text_button')}
                </p>
                <div className='lg:border-t lg:opacity-[33%] xl:my-6'></div>
                <div className='grid grid-cols-2 gap-4'>
                  <StoreButtons theme='dark' />
                </div>
              </div>
            </div>
          </div>
          {/* <div className='pointer-events-none absolute -top-[60%] left-1/2 z-10 w-full -translate-x-1/2 md:hidden'>
            <Image
              src='/hero_main_page_mobile.png'
              alt='Hero image'
              width={640}
              height={910}
              className='h-auto w-[640px]'
              priority={true}
            />
          </div>
          <div className='pointer-events-none absolute left-1/2 z-10 hidden w-full -translate-x-1/2 md:-top-[150%] md:block lg:hidden'>
            <Image
              src='/hero_main_page_tablet.png'
              alt='Hero image'
              width={1280}
              height={1612}
              className='w-[1280px]'
              priority={true}
            />
          </div>*/}
          <div className='pointer-events-none absolute -top-20 right-0 z-20 w-[265px] sm:-top-28 sm:w-[365px] lg:hidden'>
            <Image
              src='/hero_main_page_ellipse.png'
              alt='Hero image'
              width={1172}
              height={1094}
              className='relative w-full rotate-90 object-fill md:w-[415px] xl:w-[1172px]'
              priority={true}
            />
          </div>
          <div className='pointer-events absolute left-0 top-[50%] z-30 w-screen overflow-hidden sm:-left-[5%] sm:top-12 md:-left-[25%] md:top-[55%] md:w-[1070px] lg:-top-[40%] lg:left-[25%] lg:w-full xl:-right-[23%] xl:-top-[45%] 2xl:-right-[15%] 2xl:w-full'>
            <Image
              src='/hero_main_page_rocks.png'
              alt='Hero image'
              width={1268}
              height={951}
              className='relative h-[630px] w-full object-cover sm:h-[951px] sm:w-full md:h-[840px] md:w-[1070px] lg:h-[940px] lg:w-[1120px] xl:h-[1140px] xl:w-[1268px]'
              priority={true}
            />
          </div>
          <div className='pointer-events-none absolute left-[50%] top-[100%] z-10 w-[270px] -translate-x-[50%] sm:top-[130%] sm:w-[350px] md:top-[115%] lg:-top-28 lg:left-[75%] lg:w-[400px] xl:-top-32 xl:w-[500px] 2xl:left-[68%]'>
            <Image
              src='/hero_main_page_webp.webp'
              alt='Hero image'
              width={800}
              height={1200}
              className='relative h-[396px] w-[270px] object-fill sm:h-[496px] sm:w-[350px] md:h-[500px] md:w-[350px] lg:h-[600px] lg:w-[400px] xl:h-[750px] xl:w-[500px]'
              priority={true}
            />
          </div>
          <div className='pointer-events-none absolute -left-[16%] top-[60%] z-20 w-screen md:-left-[15%] md:top-[25%] lg:-top-[50%] lg:left-[75%] lg:w-[900px]'>
            <Image
              src='/hero_main_page_ellipse.png'
              alt='Hero image'
              width={1172}
              height={1094}
              className='relative w-[265px] rotate-180 object-cover sm:w-[365px] md:w-[415px] lg:w-[900px] lg:rotate-0'
              priority={true}
            />
          </div>
          {/*<div className='pointer-events-none absolute -left-[30%] z-20 object-fill lg:-right-3/4 lg:top-[-190px] xl:-right-[55%] 2xl:-right-1/3'>
            <Image
              src='/hero_main_page_ellipse.png'
              alt='Hero image'
              width={1172}
              height={1094}
              className='relative w-[265px] sm:w-[365px] md:w-[415px] xl:w-[1172px]'
              priority={true}
            />
          </div>*/}
        </div>
      </div>
    </section>
  );
}
