import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function HeroSection() {
  const t = useTranslations('airdrop.hero');

  return (
    <section className='h-[581px] bg-black py-[30px] lg:h-[700px] lg:py-[100px]'>
      <div className='container relative mx-auto px-4'>
        <div className='flex'>
          <div className='z-20 mx-auto'>
            <div className='mt-[50px] flex w-[301px] flex-col items-center text-center md:w-[600px] lg:w-[1003px] xl:mt-0'>
              <h1 className='mb-[30px] text-font30Leading110 md:text-font50Leading110 lg:bg-gradient-to-r lg:from-[#FFFFFF] lg:to-[#999999] lg:bg-clip-text lg:text-[95px] lg:font-bold lg:tracking-tight lg:text-transparent xl:leading-[110%]'>
                {t('title')}{' '}
                <span className='bg-gradient-to-r from-[#FFC996] via-[#FD6B06] to-[#963706] bg-clip-text text-transparent'>
                  {t('subtitle')}
                </span>
              </h1>
              <p className='text-ibm w-[245px] text-[13px] leading-[130%] opacity-[44%] lg:w-[512px] lg:text-font16Leading130'>
                <span className='hidden xl:contents'>[</span> {t('text')}{' '}
                <span className='hidden xl:contents'>]</span>
              </p>
            </div>
          </div>
          <div className='pointer-events-none absolute -top-[43%] left-1/2 right-[0px] z-10 w-full -translate-x-1/2 xl:top-[30%] xl:-translate-y-1/4'>
            <Image
              src='/hero_airdrop_mobile.png'
              alt='Phone'
              width={713}
              height={731}
              className='relative h-full w-[713px] md:hidden md:w-[820px]'
            />
            <Image
              src='/hero_airdrop.png'
              alt='Phone'
              width={2550}
              height={1200}
              className='relative hidden h-[1200px] w-[2550px] md:block'
            />
          </div>
        </div>
      </div>
    </section>
  );
}
