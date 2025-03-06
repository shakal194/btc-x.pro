import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function OpportunitiesSection() {
  const t = useTranslations('aboutUs.opportunities');

  return (
    <section className='rounded-t-xl bg-[#F4F4F4] py-[30px] text-black xl:py-[100px]'>
      <div className='container mx-auto mb-[20px] flex flex-col-reverse justify-between px-4 lg:mb-12 lg:flex-row lg:items-center'>
        <h2 className='text-font30Leading110 lg:mb-6 lg:text-font50Leading110'>
          {t('title')}
        </h2>
        <p className='mt-[10px] w-[250px] font-ibm text-ibm13Leading130 opacity-[33%] lg:mt-0 lg:text-ibm16Leading130'>
          {t('subtitle')}
        </p>
      </div>
      <div className='my-[20px] border-t border-black opacity-[33%] xl:my-[40px]'></div>
      <div className='container mx-auto px-4 xl:mb-12'>
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {/* Карточка 1 */}
          <div className='relative flex h-[255px] flex-col rounded-lg bg-gray-100 p-5 shadow'>
            <div className='z-10'>
              <p className='mb-[20px] text-[18px] font-semibold leading-[110%] md:text-[20px]'>
                {t('opportunities_1_title')}
              </p>
              <p className='text-13[px] w-[204px] leading-[130%] text-black/50 md:text-font16Leading110 xl:w-[348px]'>
                {t('opportunities_1_text')}
              </p>
            </div>
            <Image
              src='/about_us_opportunities_mobile.png'
              alt='Opportunities'
              width={400}
              height={296}
              className='absolute bottom-0 right-0 lg:hidden'
            />
            <Image
              src='/about_us_opportunities.png'
              alt='Opportunities'
              width={463}
              height={285}
              className='absolute -bottom-[18px] -right-[14px] hidden h-[255px] w-[463px] lg:block'
            />
          </div>
          {/* Карточка 2 */}
          <div className='relative flex h-[255px] flex-col rounded-lg bg-gray-100 p-5 shadow'>
            <div className='z-10'>
              <p className='mb-[20px] text-[18px] font-semibold leading-[110%] md:text-[20px]'>
                {t('opportunities_2_title')}
              </p>
              <p className='text-13[px] leading-[130%] text-black/50 md:text-font16Leading110'>
                {t('opportunities_2_text')}
              </p>
            </div>
            <Image
              src='/about_us_opportunities_2.png'
              alt='Opportunities 2'
              width={463}
              height={285}
              className='absolute -bottom-[18px] right-0 h-[255px] w-[463px]'
            />
          </div>
          {/* Карточка 3 */}
          <div className='relative flex h-[255px] flex-col rounded-lg bg-gray-100 p-5 shadow'>
            <div className='z-10'>
              <p className='mb-[20px] text-[18px] font-semibold leading-[110%] md:text-[20px]'>
                {t('opportunities_3_title')}
              </p>
              <p className='text-13[px] leading-[130%] text-black/50 md:text-font16Leading110'>
                {t('opportunities_3_text')}
              </p>
            </div>
            <Image
              src='/about_us_opportunities_3.png'
              alt='Opportunities 3'
              width={463}
              height={285}
              className='absolute bottom-0 right-0 h-[255px] w-[463px]'
            />
          </div>
        </div>
      </div>
    </section>
  );
}
