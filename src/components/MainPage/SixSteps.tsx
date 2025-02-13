import Image from 'next/image';
import { useTranslations } from 'next-intl';
import StoreButtons from '@/components/ui/StoreButtons';
import ScrollButtonCommunity from '@/components/ui/ScrollButtonCommunity';

export default function FiveSteps() {
  const t = useTranslations('mainPage.sixsteps');

  return (
    <section className='rounded-b-xl bg-[#F4F4F4] pb-[55px] text-black xl:py-[100px]'>
      <div className='container mx-auto px-4'>
        <div className='flex flex-col-reverse gap-8 xl:grid xl:grid-cols-2'>
          <div className='rounded-xl px-[10px] py-[30px] shadow-lg xl:px-[45px] xl:py-[60px]'>
            <p className='mb-[24px] w-[250px] font-ibm text-ibm13Leading130 opacity-[33%] xl:text-ibm16Leading130'>
              {t('subtitle')}
            </p>
            <h2 className='mb-4 text-font30Leading110 xl:text-font50Leading110'>
              {t('title')}
            </h2>
            <div className='my-[20px] border-t border-black opacity-[33%] xl:my-[40px]'></div>
            <div className='grid gap-2 md:grid-cols-2 md:gap-4 xl:grid-cols-none xl:gap-8 xl:space-y-6'>
              <div className='p-[15px] xl:mb-5 xl:p-[30px]'>
                <span className='font16Leading130 rounded-full border px-[10px] py-[3px] text-[10px] leading-[120%] xl:px-[20px] xl:py-[4px]'>
                  {t('step_1_number')}
                </span>
                <h3 className='mb-[15px] mt-[28px] text-font16Leading120 lg:text-font22Leading120'>
                  {t('step_1_title')}
                </h3>
                <p className='mb-[20px] leading-[130%] text-black/50'>
                  {t('step_1_subtitle')}
                </p>
                <div className='flex justify-between'>
                  <StoreButtons theme='light' />
                </div>
              </div>
              <div className='p-[15px] xl:mb-5 xl:p-[30px]'>
                <span className='font16Leading130 rounded-full border px-[10px] py-[3px] text-[10px] leading-[120%] xl:px-[20px] xl:py-[4px]'>
                  {t('step_2_number')}
                </span>
                <h3 className='mb-[15px] mt-[28px] text-font16Leading120 lg:text-font22Leading120'>
                  {t('step_2_title')}
                </h3>
                <p className='leading-[130%] text-black/50'>
                  {t('step_2_subtitle')}
                </p>
              </div>
              <div className='p-[15px] xl:mb-5 xl:p-[30px]'>
                <span className='font16Leading130 rounded-full border px-[10px] py-[3px] text-[10px] leading-[120%] xl:px-[20px] xl:py-[4px]'>
                  {t('step_3_number')}
                </span>
                <h3 className='mb-[15px] mt-[28px] text-font16Leading120 lg:text-font22Leading120'>
                  {t('step_3_title')}
                </h3>
                <p className='leading-[130%] text-black/50'>
                  {t('step_3_subtitle')}
                </p>
              </div>
              <div className='p-[15px] xl:mb-5 xl:p-[30px]'>
                <span className='font16Leading130 rounded-full border px-[10px] py-[3px] text-[10px] leading-[120%] xl:px-[20px] xl:py-[4px]'>
                  {t('step_4_number')}
                </span>
                <h3 className='mb-[15px] mt-[28px] text-font16Leading120 lg:text-font22Leading120'>
                  {t('step_4_title')}
                </h3>
                <p className='leading-[130%] text-black/50'>
                  {t('step_4_subtitle')}
                </p>
              </div>
              <div className='p-[15px] xl:mb-5 xl:p-[30px]'>
                <span className='font16Leading130 rounded-full border px-[10px] py-[3px] text-[10px] leading-[120%] xl:px-[20px] xl:py-[4px]'>
                  {t('step_5_number')}
                </span>
                <h3 className='mb-[15px] mt-[28px] text-font16Leading120 lg:text-font22Leading120'>
                  {t('step_5_title')}
                </h3>
                <p className='leading-[130%] text-black/50'>
                  {t('step_5_subtitle')}
                </p>
              </div>
              <div className='p-[15px] xl:mb-5 xl:p-[30px]'>
                <span className='font16Leading130 rounded-full border px-[10px] py-[3px] text-[10px] leading-[120%] xl:px-[20px] xl:py-[4px]'>
                  {t('step_6_number')}
                </span>
                <h3 className='mb-[15px] mt-[28px] text-font16Leading120 lg:text-font22Leading120'>
                  {t('step_6_title')}
                </h3>
                <p className='leading-[130%] text-black/50'>
                  {t('step_6_subtitle')}
                </p>
                <ScrollButtonCommunity />
              </div>
            </div>
          </div>
          {/* Image Section */}
          <div className='relative xl:h-[700px]'>
            {/* Фоновое изображение */}
            <Image
              src='/client.png'
              alt='Client image'
              width={670}
              height={700}
              className='w-full rounded-lg'
            />

            {/* Отзыв */}

            <blockquote className='absolute bottom-[10px] left-1/2 w-[90%] -translate-x-1/2 transform rounded-3xl pb-[15px] pl-[11px] shadow-lg backdrop-blur-lg xl:bottom-0 xl:pb-[27px] xl:pl-[40px]'>
              <Image
                src='/quote.svg'
                alt='quote'
                width={30}
                height={22}
                className='my-[10px] h-[10px] w-[14px] rounded-full md:my-[14px] md:h-[16px] md:w-[20px] xl:mb-[20px] xl:mt-[25px] xl:h-[22px] xl:w-[30px]'
              />
              <p className='text-[10px] leading-[120%] text-white md:text-[16px] xl:text-[22px]'>
                {t('quotes_text')}
              </p>
              <div className='mt-5'>
                <div className='flex items-center'>
                  <Image
                    src='/avatar.png'
                    alt='Avatar'
                    width={40}
                    height={40}
                    className='rounded-full'
                  />
                  <div className='ml-5'>
                    <div className='flex'>
                      {[...Array(5)].map((_, i) => (
                        <Image
                          key={i}
                          src='/Star.svg'
                          alt='Star'
                          width={15}
                          height={15}
                          className='h-[15px] w-[15px] rounded-full'
                        />
                      ))}
                    </div>
                    <p className='mt-2 text-sm text-white'>
                      {t('quotes_author')}
                    </p>
                  </div>
                </div>
              </div>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
