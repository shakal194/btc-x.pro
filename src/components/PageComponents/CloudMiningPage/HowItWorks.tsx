import Image from 'next/image';
import { useTranslations } from 'next-intl';
import SliderCloudMiningProgram from '@/components/ui/SliderCloudMiningProgram';

export default function HowItWorksSection() {
  const t = useTranslations('cloudMiningPage.howItWorks');

  return (
    <section className='relative z-20 rounded-xl bg-[#F4F4F4] py-[30px] text-black lg:py-[100px]'>
      <div className='container mx-auto px-4'>
        {/* Статистика */}
        <div className='flex flex-col-reverse justify-between md:flex-row md:items-center lg:mb-12'>
          <h2 className='text-font30Leading110 lg:mb-6 lg:text-font50Leading110'>
            {t('title')}
          </h2>
          <p className='mb-[10px] w-[155px] font-ibm text-ibm13Leading130 opacity-[33%] lg:mb-0 lg:w-[250px] lg:text-ibm16Leading130'>
            {t('subtitle')}
          </p>
        </div>
        <div className='my-[20px] border-t border-black opacity-[33%] lg:my-[40px]'></div>
        {/* Блоки контента */}
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
          {/* Блок 1 */}
          <div className='grid grid-cols-6 gap-8'>
            <div className='flex flex-col items-center justify-evenly'>
              <div className='flex h-[40px] w-[40px] items-center justify-center rounded-full border border-black/30 lg:h-[65px] lg:w-[65px]'>
                <p className='text-font18Leading130 lg:text-font30Leading130'>
                  {t('step_1_number')}
                </p>
              </div>
              <div className='mx-auto h-[25%] border-2 border-l border-dashed'></div>
              <div className='flex h-[40px] w-[40px] items-center justify-center rounded-full border border-black/30 lg:h-[65px] lg:w-[65px]'>
                <p className='text-font18Leading130 lg:text-font30Leading130'>
                  {t('step_2_number')}
                </p>
              </div>
              <div className='mx-auto h-[25%] border-2 border-l border-dashed'></div>
              <div className='flex h-[40px] w-[40px] items-center justify-center rounded-full border border-black/30 lg:h-[65px] lg:w-[65px]'>
                <p className='text-font18Leading130 lg:text-font30Leading130'>
                  {t('step_3_number')}
                </p>
              </div>
            </div>
            <div className='col-span-5 flex w-[295px] flex-col justify-between gap-4 lg:w-[425px] lg:gap-8'>
              <div className='flex flex-col justify-between'>
                <h4 className='mb-[7px] text-font18Leading130 lg:mb-[20px] lg:text-font30Leading130'>
                  {t('step_1_title')}
                </h4>
                <p className='text-[13px] leading-[120%] opacity-[50%] lg:text-font18'>
                  {t('step_1_subtitle')}
                </p>
              </div>
              <div className='flex flex-col justify-between'>
                <h4 className='mb-[7px] text-font18Leading130 lg:mb-[20px] lg:text-font30Leading130'>
                  {t('step_2_title')}
                </h4>
                <p className='text-[13px] leading-[120%] opacity-[50%] lg:text-font18'>
                  {t('step_2_subtitle')}
                </p>
              </div>
              <div className='flex flex-col justify-between'>
                <h4 className='mb-[7px] text-font18Leading130 lg:mb-[20px] lg:text-font30Leading130'>
                  {t('step_3_title')}
                </h4>
                <p className='text-[13px] leading-[120%] opacity-[50%] lg:text-font18'>
                  {t('step_3_subtitle')}
                </p>
              </div>
            </div>
          </div>
          <div>
            <Image
              src='/cloud_mining_howitworks.webp'
              alt='How it works'
              unoptimized={true}
              width={670}
              height={560}
              className='h-[300px] w-full rounded-lg lg:h-[560px] lg:w-[670px]'
            ></Image>
          </div>
        </div>
        <div className='mb-12 mt-[90px] flex w-full flex-col justify-between lg:mt-[150px] xl:flex-row'>
          <div className='mx-auto space-y-16'>
            <h2 className='mb-6 text-[28px] font-semibold leading-[110%] tracking-tight md:w-[450px] md:text-font30Leading110 lg:w-[885px] lg:text-font50Leading110 lg:font-semibold'>
              {t('title_2')}
            </h2>
            <SliderCloudMiningProgram />
          </div>
        </div>
      </div>
    </section>
  );
}
