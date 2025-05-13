import Image from 'next/image';
import { useTranslations } from 'next-intl';
import StoreButtons from '@/components/ui/StoreButtons';

export default function AboutUsSection() {
  const t = useTranslations('aboutUs.aboutUs');

  return (
    <section className='bg-black pb-[90px] xl:py-[100px]'>
      <div className='container z-20 mx-auto mt-[248px] px-4 md:mt-[60px] xl:mt-[170px]'>
        {/* О нас */}
        <div className='grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4 xl:gap-8'>
          <div className='flex flex-col-reverse gap-2 md:flex-col'>
            <h2 className='text-font30Leading110 lg:mb-6 lg:text-font50Leading110'>
              {t('title')}
            </h2>
            <p className='w-[168px] font-ibm text-ibm13Leading130 opacity-[33%] lg:w-[250px] lg:text-ibm16Leading130'>
              {t('subtitle')}
            </p>
          </div>
          <div className='my-[16px] border-t opacity-[33%] md:hidden'></div>
          <div>
            <p className='mb-[30px] text-[13px] leading-[130%] md:text-font18Leading130 lg:text-font30Leading130'>
              {t('text')}
            </p>
            <Image
              src='/founder_btc-x.jpg'
              alt='Founder BTC-X'
              width={375}
              height={453}
              className='h-[453px] w-[375px] rounded-lg'
            />
            <p className='mt-[10px] w-[250px] font-ibm text-ibm13Leading130 opacity-[33%] lg:text-ibm16Leading130'>
              {t('image_alt')}
            </p>
          </div>
        </div>
        {/* Наша цель */}
        <div className='mt-[90px] xl:mb-[60px] xl:mt-[148px]'>
          <h2 className='mb-[20px] text-font18Leading130 text-white/30 md:text-font30Leading110 lg:text-font50Leading110'>
            {t('title_2')}{' '}
            <span className='bg-gradient-to-r from-[#FFC996] via-[#FD6B06] to-[#963706] bg-clip-text text-transparent'>
              {t('subtitle_2')}
            </span>
          </h2>
        </div>
        <div className='md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-1 lg:gap-8'>
          <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
            {/* Image Section */}
            <div className='relative'>
              {/* Фоновое изображение */}
              <Image
                src='/about_us_team1.jpg'
                alt='Our Team'
                width={4160}
                height={2757}
                className='w-[4160px] rounded-lg md:h-full'
              />
            </div>
            <div className='hidden flex-col justify-between lg:flex'>
              <div>
                <div className='mb-[40px] border-t border-white opacity-[33%]'></div>
                <p className='text-font18 leading-[120%]'>{t('text_2')}</p>
              </div>
              <div className='flex items-center gap-8'>
                <Image src='/qr.png' alt='QR Code' width={169} height={169} />
                <div>
                  <h2 className='mb-[40px] text-font30Leading110 xl:text-font50Leading110'>
                    {t('qr_alt')}
                  </h2>
                  <p className='w-[250px] font-ibm text-ibm13Leading130 opacity-[33%] lg:text-ibm16Leading130'>
                    {t('qr_text')}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className='container mx-auto mt-[90px] flex flex-col items-center md:mt-0 lg:flex-row xl:mt-16 xl:w-[1190px] xl:flex-col'>
            <div className='md:flex md:flex-col md:items-center'>
              <p className='mb-[25px] w-[234px] text-center font-ibm text-ibm13Leading130 opacity-[33%] lg:text-ibm16Leading130 xl:mb-[40px] xl:w-[375px]'>
                {t('subtitle_3')}
              </p>
              <div className='flex items-center'>
                <Image
                  src='/about_us_btcx.png'
                  alt='BTC-X Icon'
                  width={63}
                  height={63}
                  className='mr-[5px] h-[63px] w-[63px] xl:hidden'
                />
                <h4 className='col-span-3 text-font16Leading120 xl:hidden'>
                  {t('title_3_mobile')}
                </h4>
                <h4 className='mb-[40px] hidden text-center text-[40px] font-semibold leading-[125%] tracking-tight xl:block'>
                  {t('title_3_desktop')}
                </h4>
              </div>
            </div>
            <div className='my-[25px] w-full border-t border-white opacity-[33%] lg:hidden'></div>
            <div className='relative w-full rounded-lg bg-gradient-to-r from-[#553300] to-[#FE9900] p-[1px] lg:w-[435px] xl:w-auto xl:bg-none'>
              <div className='rounded-lg bg-black px-[25px] py-6'>
                <p className='mb-[20px] text-[13px] font-medium leading-[130%] opacity-[33%] lg:text-font18 lg:font-semibold lg:opacity-100 xl:hidden'>
                  {t('text_3')}
                </p>
                <div className='grid grid-cols-2 gap-4'>
                  <StoreButtons theme='dark' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
