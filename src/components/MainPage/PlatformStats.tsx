import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import TradePowerLocalizedImage from '@/components/ui/TradePowerLocalizedImage';

export default function PlatformStats() {
  const t = useTranslations('mainPage.platformStats');

  return (
    <>
      <section className='rounded-t-xl bg-[#F4F4F4] pt-[30px] text-black xl:py-[100px]'>
        <div className='container mx-auto px-4'>
          {/* Статистика */}
          <div className='mb-[20px] flex flex-col-reverse justify-between xl:mb-12 xl:flex-row xl:items-center'>
            <h2 className='mb-6 text-font30Leading110 xl:text-font50Leading110'>
              {t('title')}
            </h2>
            <p className='mb-[10px] w-[145px] font-ibm text-ibm13Leading130 opacity-[33%] xl:mb-0 xl:w-[250px] xl:text-ibm16Leading130'>
              {t('subtitle')}
            </p>
          </div>
          <div className='my-[25px] border-t border-black opacity-[33%] xl:my-[40px]'></div>
          <div className='mb-12'>
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4'>
              {/* Карточка 1 */}
              <div className='flex h-[200px] w-full flex-col justify-between rounded-lg bg-gray-100 p-5 shadow'>
                <p className='text-font16Leading120 xl:text-font22Leading120'>
                  {t('stats_1_title')}
                </p>
                <div>
                  <div className='flex items-center'>
                    <Image
                      src='/live_icon.svg'
                      alt='Live Icon'
                      width={6}
                      height={6}
                      className='h-[6px] w-[6px]'
                    ></Image>
                    <p className='ml-[3px] font-ibm text-ibm13Leading130 leading-[130%] tracking-tight text-[#69DF40] xl:text-ibm16Leading130'>
                      {t('stats_1_live')}
                    </p>
                  </div>
                  <h3 className='text-[45px] font-semibold leading-[120%] xl:text-[50px] xl:font-bold'>
                    {t('stats_1_data')}
                  </h3>
                </div>
              </div>
              {/* Карточка 2 */}
              <div className='flex h-[200px] w-full flex-col justify-between rounded-lg bg-gray-100 p-5 shadow'>
                <p className='text-font16Leading120 text-font22Leading120'>
                  {t('stats_2_title')}{' '}
                  <span className='opacity-[33%]'>{t('stats_2_subtitle')}</span>
                </p>
                <h3 className='text-[45px] font-semibold leading-[120%] xl:text-[50px] xl:font-bold'>
                  {t('stats_2_data')}
                </h3>
              </div>
              {/* Карточка 3 */}
              <div className='flex h-[200px] w-full flex-col justify-between rounded-lg bg-gray-100 p-5 shadow'>
                <p className='text-font16Leading120 text-font22Leading120'>
                  {t('stats_3_title')}
                </p>
                <div>
                  <div className='flex items-center'>
                    <Image
                      src='/live_icon.svg'
                      alt='Live Icon'
                      width={6}
                      height={6}
                      className='h-[6px] w-[6px]'
                    ></Image>
                    <p className='ml-[3px] font-ibm text-ibm13Leading130 leading-[130%] tracking-tight text-[#69DF40] xl:text-ibm16Leading130'>
                      {t('stats_3_live')}
                    </p>
                  </div>
                  <h3 className='text-[45px] font-semibold leading-[120%] xl:text-[50px] xl:font-bold'>
                    {t('stats_3_data')}
                  </h3>
                </div>
              </div>
              {/* Карточка 4 */}
              <div className='flex h-[200px] w-full flex-col justify-between rounded-lg bg-gray-100 p-5 shadow'>
                <p className='text-font16Leading120 text-font22Leading120'>
                  {t('stats_4_title')}{' '}
                  <span className='opacity-[33%]'>{t('stats_4_subtitle')}</span>
                </p>
                <h3 className='text-[45px] font-semibold leading-[120%] xl:text-[50px] xl:font-bold'>
                  {t('stats_4_data')}
                </h3>
              </div>
            </div>
          </div>

          {/* Заголовок и подзаголовок */}
          <div className='mb-[25px] xl:mb-12'>
            <div className='flex justify-between'>
              <p className='hidden w-[250px] font-ibm text-ibm13Leading130 opacity-[33%] xl:block xl:text-ibm16Leading130'>
                {t('title_2')}
              </p>
              <h2 className='mb-4 text-font30Leading110 tracking-tight xl:w-[630px] xl:text-font50Leading110'>
                {t('subtitle_2')}
              </h2>
            </div>
          </div>

          {/* Блоки контента */}
          <div className='space-y-12'>
            {/* Блок 1 */}
            <div className='my-4 border-t border-black opacity-[33%]'></div>
            <div className='grid grid-cols-1 items-start gap-8 xl:grid-cols-2'>
              <div className='flex items-center justify-between xl:hidden'>
                <h4 className='w-[231px] text-font18Leading130'>
                  {t('advantage_1_title')}
                </h4>
                <p className='font-ibm text-ibm13Leading130 opacity-[33%]'>
                  {t('advantage_1_number')}
                </p>
              </div>
              <div>
                <Image
                  src='/comission.png'
                  alt='0 comission'
                  width={630}
                  height={290}
                  className='w-full'
                ></Image>
              </div>
              <div className='flex h-full flex-col justify-between gap-2 md:gap-4'>
                <div className='hidden items-center justify-between xl:flex'>
                  <h4 className='w-[231px] text-font18Leading130 xl:w-2/3 xl:text-font30Leading130'>
                    {t('advantage_1_title')}
                  </h4>
                  <p className='font-ibm text-ibm13Leading130 opacity-[33%] xl:text-ibm16Leading130'>
                    {t('advantage_1_number')}
                  </p>
                </div>
                <div className='flex flex-col justify-between gap-2 md:flex-row md:gap-4 lg:gap-8'>
                  <div className='flex flex-col items-start gap-2 text-[13px] leading-[100%] leading-[120%] xl:text-primary'>
                    <div className='flex items-center'>
                      <Image
                        src='/arrows.png'
                        alt='Arrow'
                        width={42}
                        height={42}
                        className='h-[42px] w-[42px] rotate-180'
                      />
                      <p className='rounded-full border px-3 py-2 text-center'>
                        {t('advantage_1_subtitle')}
                      </p>
                    </div>
                    <div className='flex items-center'>
                      <p className='rounded-full border px-3 py-2 text-center'>
                        {t('advantage_1_subtitle_2')}
                      </p>
                      <Image
                        src='/arrows.png'
                        alt='Arrow'
                        width={42}
                        height={42}
                        className='h-[42px] w-[42px] rotate-180'
                      />
                    </div>
                  </div>
                  <div className='grid grid-rows-2 items-start gap-2 text-[13px] leading-[100%] leading-[120%] xl:text-primary'>
                    <div className='rounded-full border px-3 py-2 text-center'>
                      <p>{t('advantage_1_subtitle_3')}</p>
                    </div>
                    <div className='rounded-full border px-3 py-2 text-center'>
                      <p>{t('advantage_1_subtitle_4')}</p>
                    </div>
                  </div>
                </div>
                <p>{t('advantage_1_subtitle_5')}</p>
              </div>
            </div>
            {/* Блок 2 */}
            <div className='my-4 border-t border-black opacity-[33%]'></div>
            <div className='grid grid-cols-1 items-start gap-8 xl:grid-cols-2'>
              <div className='flex items-center justify-between xl:hidden'>
                <h4 className='w-[231px] text-font18Leading130'>
                  {t('advantage_2_title')}
                </h4>
                <p className='font-ibm text-ibm13Leading130 opacity-[33%]'>
                  {t('advantage_2_number')}
                </p>
              </div>
              <TradePowerLocalizedImage />
              <div className='flex h-full flex-col justify-between gap-2 md:gap-4'>
                <div className='hidden items-center justify-between xl:flex'>
                  <h4 className='w-[231px] text-font18Leading130 xl:w-2/3 xl:text-font30Leading130'>
                    {t('advantage_2_title')}
                  </h4>
                  <p className='font-ibm text-ibm13Leading130 opacity-[33%] xl:text-ibm16Leading130'>
                    {t('advantage_2_number')}
                  </p>
                </div>
                <p>{t('advantage_2_subtitle')}</p>
                <p>
                  {t('advantage_2_subtitle_2')}{' '}
                  <span className='text-[#FE9900]'>
                    {t('advantage_2_subtitle_3')}
                  </span>
                </p>
                <Link
                  href='https://onelink.to/js2s8h'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='hidden w-[240px] rounded-full border px-3 py-2 text-center text-primary font-bold leading-[100%] transition hover:bg-[#FD6B06] hover:text-white lg:block'
                >
                  {t('advantage_link')}
                </Link>
              </div>
            </div>
            {/* Блок 3 */}
            <div className='my-4 border-t border-black opacity-[33%]'></div>
            <div className='grid grid-cols-1 items-start gap-8 xl:grid-cols-2'>
              <div className='flex items-center justify-between xl:hidden'>
                <h4 className='w-[231px] text-font18Leading130'>
                  {t('advantage_3_title')}
                </h4>
                <p className='font-ibm text-ibm13Leading130 opacity-[33%]'>
                  {t('advantage_3_number')}
                </p>
              </div>
              <div>
                <Image
                  src='/price.png'
                  alt='Real prices'
                  width={630}
                  height={290}
                  className='w-full'
                />
              </div>
              <div className='flex h-full flex-col justify-between gap-2 md:gap-4'>
                <div className='hidden items-center justify-between xl:flex'>
                  <h4 className='w-[231px] text-font18Leading130 xl:w-2/3 xl:text-font30Leading130'>
                    {t('advantage_3_title')}
                  </h4>
                  <p className='font-ibm text-ibm13Leading130 opacity-[33%] xl:text-ibm16Leading130'>
                    {t('advantage_3_number')}
                  </p>
                </div>
                <p>
                  {t('advantage_3_subtitle')}{' '}
                  <span className='text-[#FE9900]'>
                    {t('advantage_3_subtitle_2')}
                  </span>{' '}
                  {t('advantage_3_subtitle_3')}
                </p>
                <p>
                  {t('advantage_3_subtitle_4')}{' '}
                  <span className='text-[#FE9900]'>
                    {t('advantage_3_subtitle_5')}
                  </span>{' '}
                  {t('advantage_3_subtitle_6')}
                </p>
                <Link
                  href='https://onelink.to/js2s8h'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='hidden w-[240px] rounded-full border px-3 py-2 text-center text-primary font-bold leading-[100%] transition hover:bg-[#FD6B06] hover:text-white lg:block'
                >
                  {t('advantage_link')}
                </Link>
              </div>
            </div>
            <div className='my-4 border-t border-black opacity-[33%]'></div>
          </div>
        </div>
      </section>
      <section className='bg-[#F4F4F4] py-[120px] text-black xl:py-[100px]'>
        {/* Миссия */}
        <div className='container mx-auto flex flex-col items-center xl:mt-16 xl:w-[1020px]'>
          <p className='mb-[15px] w-[250px] text-center font-ibm text-ibm13Leading130 opacity-[33%] xl:mb-[30px] xl:text-ibm16Leading130'>
            {t('mission_title')}
          </p>
          <h4 className='text-center text-[18px] font-medium leading-[125%] tracking-tight lg:text-[40px] lg:font-bold'>
            {t('mission_subtitle')}
          </h4>
        </div>
      </section>
    </>
  );
}
