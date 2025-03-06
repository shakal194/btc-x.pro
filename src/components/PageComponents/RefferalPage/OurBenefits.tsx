import Image from 'next/image';
import { useTranslations } from 'next-intl';
import StoreButtons from '@/components/ui/StoreButtons';

export default function OurBenefitsSection() {
  const t = useTranslations('referralPage.ourBenefits');

  return (
    <section className='rounded-t-xl bg-[#F4F4F4] py-[30px] text-black lg:py-[100px]'>
      <div className='container mx-auto px-4'>
        <div className='md:grid md:grid-cols-2 md:gap-4 lg:gap-8'>
          <div className='flex justify-between md:flex-col'>
            <h2 className='text-font30Leading110 lg:text-font50Leading110'>
              {t('title')}
            </h2>
            <div className='flex w-full items-end justify-end md:block'>
              <Image
                src='/ref_page_btcx.png'
                width={140}
                height={140}
                alt='Bitcoin coin'
                className='h-[57px] w-[57px] object-cover lg:h-[140px] lg:w-[140px]'
              />
              <p className='mt-[15px] hidden w-[250px] font-ibm text-ibm13Leading130 opacity-[33%] md:block lg:text-ibm16Leading130'>
                {t('subtitle')}
              </p>
            </div>
          </div>
          <div>
            {[
              {
                image: '/guarantee_icon.svg',
                title: `${t('benefits1_title')}`,
                text: `${t('benefits1_text')}`,
              },
              {
                image: '/referal_icon.svg',

                title: `${t('benefits2_title')}`,
                text: `${t('benefits2_text')}`,
              },
              {
                image: '/save_money_icon.svg',

                title: `${t('benefits3_title')}`,
                text: `${t('benefits3_text')}`,
              },
            ].map((program, index) => (
              <div
                key={index}
                className='px-[15px] py-[20px] lg:px-[30px] lg:py-[30px]'
              >
                <div className='relative grid grid-cols-4 items-center gap-2 md:gap-4 lg:gap-8'>
                  {/* Картинка */}
                  <div className='flex h-[51px] w-[51px] items-center justify-center rounded-full border lg:h-[100px] lg:w-[100px]'>
                    <Image
                      src={program.image}
                      alt={`Advantages our programm ${index + 1}`}
                      width={50}
                      height={50}
                      className='h-[25px] w-[25px] object-cover lg:h-[50px] lg:w-[50px]'
                    />
                  </div>
                  {/* Текст */}
                  <div className='col-span-3'>
                    <h3 className='mb-[20px] text-font18Leading130 lg:text-font30Leading130'>
                      {program.title}
                    </h3>
                    <p className='text-[13px] leading-[120%] text-black/50 lg:text-font18'>
                      {program.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className='container mx-auto mt-[90px] px-4 text-center lg:mt-[150px]'>
          <Image
            src='/logo_black.png'
            alt='Logo'
            width={133}
            height={133}
            className='mx-auto h-[50px] w-[50px] lg:h-[133px] lg:w-[133px]'
          />
          <h2 className='mb-[25px] text-[28px] text-font30Leading110 leading-[110%] tracking-tight lg:mb-[49px] lg:text-font50Leading110 xl:text-[105px]'>
            {t('title2')}
          </h2>
          <h3 className='mx-auto w-[274px] text-[13px] leading-[130%] opacity-[33%] lg:hidden'>
            {t('title3')}
          </h3>
          <h3 className='mx-auto hidden w-[525px] text-[22px] leading-[120%] opacity-[33%] lg:block'>
            {t('title4')}
          </h3>
          <div className='mt-5 flex justify-center gap-4'>
            <StoreButtons theme='light' />
          </div>
        </div>
      </div>
    </section>
  );
}
