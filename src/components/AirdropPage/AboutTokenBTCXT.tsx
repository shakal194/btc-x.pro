import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import SliderAboutUsAboutToken from '@/components/ui/SliderAboutUsAboutToken';

export default function AboutTokenSection() {
  const t = useTranslations('airdrop.aboutToken');

  return (
    <section className='relative z-10 space-y-10 bg-[#F4F4F4] py-[30px] text-black lg:py-[100px]'>
      <div className='container mx-auto space-y-[50px] px-4'>
        <div className='relative'>
          {/*<h1 className='text-[400px] font-bold opacity-[2%]'>ВТСХT</h1>*/}

          <div className='mx-auto flex flex-col items-center xl:w-[1210px]'>
            <p className='mb-[30px] w-[82px] text-center font-ibm text-ibm13Leading130 opacity-[33%] lg:w-[250px] lg:text-ibm16Leading130'>
              {t('subtitle')}
            </p>
            <h4 className='text-center text-font16Leading120 md:text-font22Leading120 lg:text-[40px] lg:font-semibold lg:leading-[125%] lg:tracking-tight'>
              {t('title')}
            </h4>
          </div>
          <SliderAboutUsAboutToken />

          {/*<div>
          <Image
              src='/btcxt.png'
              alt='BTCX TOKEN'
              width={1340}
              height={328}
              className='h-[77px] w-[320px] object-cover md:h-[100px] md:w-[500px] xl:h-[328px] xl:w-[1340px]'
            />
        </div>*/}
        </div>
        <div className='mb-12 items-end justify-between lg:flex'>
          <h2 className='w-[274px] text-font30Leading110 tracking-tight md:w-[400px] lg:w-[514px] lg:text-font50Leading110'>
            {t('title_2')}
          </h2>
          <div className='my-6 border-t border-black opacity-[33%] lg:hidden'></div>
          <p className='w-[339px] text-primary font-semibold leading-[110%]'>
            {t('subtitle_2')}{' '}
            <span className='text-[#FE9900]'>{t('subtitle2_1')}</span>{' '}
            {t('subtitle2_2')}
          </p>
        </div>
        <div className='my-[40px] hidden border-t border-black opacity-[33%] lg:block'></div>
        {/* Блоки контента */}
        <div className='xl:mb-[140px]'>
          {/* Контейнер с шагами */}
          <div className='flex flex-col items-center gap-8 lg:flex-row lg:justify-between'>
            {/* Блок с шагами */}
            <div className='grid grid-cols-5 gap-2 md:grid-cols-2 xl:grid-cols-1'>
              <div className='mb-[28px] flex w-[77%] flex-col items-center xl:flex-row xl:justify-between'>
                {/* Крок 1 */}
                <div className='flex items-center justify-center rounded-full px-[10px] py-[6px] shadow-lg lg:px-[20px] lg:py-[10px]'>
                  <p className='text-[10px] leading-[120%] lg:text-font16Leading110'>
                    {t('step_1_number')}
                  </p>
                </div>
                <div className='mx-auto h-full border border-l border-dashed xl:block xl:h-auto xl:w-[30%] xl:border-b'></div>
                {/* Крок 2 */}
                <div className='flex items-center justify-center rounded-full px-[10px] py-[6px] shadow-lg lg:px-[20px] lg:py-[10px]'>
                  <p className='text-[10px] leading-[120%] lg:text-font16Leading110'>
                    {t('step_2_number')}
                  </p>
                </div>
                <div className='mx-auto h-full border border-l border-dashed xl:block xl:h-auto xl:w-[30%] xl:border-b'></div>
                {/* Крок 3 */}
                <div className='flex items-center justify-center rounded-full px-[10px] py-[6px] shadow-lg lg:px-[20px] lg:py-[10px]'>
                  <p className='text-[10px] leading-[120%] lg:text-font16Leading110'>
                    {t('step_3_number')}
                  </p>
                </div>
              </div>

              {/* Описание шагов */}
              <div className='cols-span-4 md:cols-span-0 flex flex-col gap-8 xl:flex-row'>
                <div className='flex w-[300px] flex-col'>
                  <h4 className='mb-[15px] text-[18px] font-semibold leading-[120%] lg:text-[20px]'>
                    {t('step_1_title')}
                  </h4>
                  <p className='text-[13px] leading-[130%] opacity-[50%] lg:text-font16Leading130'>
                    {t('step_1_subtitle')}
                  </p>
                </div>

                <div className='flex w-[300px] flex-col'>
                  <h4 className='mb-[15px] text-[18px] font-semibold leading-[120%] lg:text-[20px]'>
                    {t('step_2_title')}
                  </h4>
                  <p className='text-[13px] leading-[130%] opacity-[50%] lg:text-font16Leading130'>
                    {t('step_2_subtitle')}
                  </p>
                </div>

                <div className='flex w-[300px] flex-col'>
                  <h4 className='mb-[15px] text-[18px] font-semibold leading-[120%] lg:text-[20px]'>
                    {t('step_3_title')}
                  </h4>
                  <p className='text-[13px] leading-[130%] opacity-[50%] lg:text-font16Leading130'>
                    {t('step_3_subtitle')}
                  </p>
                </div>
              </div>
            </div>

            {/* Бонусный блок */}
            <div className='relative w-full md:w-[290px]'>
              <div className='absolute px-[27px] pt-[30px]'>
                <h4 className='bg-gradient-to-r from-[#FFFFFF] to-[#999999] bg-clip-text text-[25px] font-bold leading-[120%] text-transparent'>
                  {t('title_3')}
                </h4>
                <p className='text-white/50'>
                  {t('subtitle_3')}{' '}
                  <span className='text-[#FE9900]'>{t('subtitle_3_1')}</span>{' '}
                  {t('subtitle_3_2')}
                </p>
                <Link
                  href='https://onelink.to/js2s8h'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='mt-[25px] block w-[250px] rounded-full border px-5 py-3 text-center text-primary font-bold leading-[100%] text-white transition hover:border-[#FD6B06] hover:bg-[#FD6B06] hover:text-white focus:bg-[#FD6B06] focus:text-white xl:mt-[30px]'
                >
                  {t('text_link')}
                </Link>
              </div>
              <Image
                src='/airdrop_btcxt_token.png'
                alt='Airdrop 1'
                width={290}
                height={287}
                className='h-[287px] w-full rounded-3xl object-cover xl:w-[290px]'
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
