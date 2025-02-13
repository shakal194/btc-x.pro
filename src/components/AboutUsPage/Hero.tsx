import Image from 'next/image';
import { useTranslations } from 'next-intl';
import StoreButtons from '@/components/ui/StoreButtons';

export default function HeroSection() {
  const t = useTranslations('aboutUs.hero');

  return (
    <section className='bg-black py-[15px] xl:pt-[100px]'>
      <div className='container relative mx-auto px-4'>
        <div className='flex'>
          <div className='relative z-20 mx-auto flex flex-col-reverse gap-2 md:grid md:grid-cols-2 md:gap-4'>
            <div className='absolute top-2/3 z-10 flex w-[300px] flex-col md:relative md:top-0 xl:w-[540px]'>
              <h1 className='text-[35px] leading-[110%] tracking-tight lg:text-font50Leading110 xl:mb-[88px] xl:text-font70Leading110'>
                {t('title')}{' '}
                <span className='bg-gradient-to-r from-[#FFC996] via-[#FD6B06] to-[#963706] bg-clip-text text-transparent'>
                  {t('subtitle')}
                </span>
              </h1>
              <div className='relative rounded-lg from-[#553300] to-[#FE9900] p-[1px] xl:w-[435px] xl:bg-gradient-to-r'>
                <div className='rounded-lg py-6 xl:bg-black xl:px-[25px]'>
                  <p className='text-[13px] font-medium leading-[130%] lg:text-primary lg:font-semibold lg:opacity-100 xl:max-w-3xl'>
                    {t('text')}
                  </p>
                  <div className='my-6 hidden border-t opacity-[33%] xl:block'></div>
                  <div className='mt-[20px] flex justify-between xl:mt-0'>
                    <StoreButtons theme='dark' />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <Image
                src='/hero_about_us_mobile.png'
                alt='Our Team'
                width={670}
                height={600}
                className='h-full rounded-3xl object-cover md:hidden'
              />
              <Image
                src='/hero_about_us.png'
                alt='Our Team'
                width={670}
                height={600}
                className='hidden h-full w-[670px] rounded-3xl object-cover md:block'
              />
            </div>
          </div>
          <div className='pointer-events-none absolute -top-1/4 z-10 hidden w-full lg:block'>
            <Image
              src='/hero_about_us_background.png'
              alt='About Us background'
              width={1268}
              height={951}
              className='relative h-full w-[1268px]'
            />
          </div>
        </div>
      </div>
    </section>
  );
}
