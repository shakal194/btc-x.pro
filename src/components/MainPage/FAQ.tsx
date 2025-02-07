import Image from 'next/image';
import { useTranslations } from 'next-intl';
import StoreButtons from '@/components/ui/StoreButtons';
import AccordionFaq from '@/components/ui/AccordionFaq';

export default function FAQAndFooter() {
  const t = useTranslations('mainPage.faq');

  return (
    <section className='rounded-t-xl bg-[#F4F4F4] py-[30px] text-black lg:py-[100px]'>
      <div className='container mx-auto px-4'>
        <div className='justify-between lg:flex'>
          <h2 className='mb-6 text-font30Leading110 lg:text-font50Leading110'>
            {t('title')}
          </h2>
          <div className='space-y-5 lg:w-[75%]'>
            <AccordionFaq />
          </div>
        </div>
        <div className='mx-auto mt-[49px] text-center lg:mt-[150px] lg:w-[881px]'>
          <Image
            src='/logo_black.png'
            alt='Logo'
            width={133}
            height={133}
            className='mx-auto'
          />
          <h2 className='mb:[25px] hidden text-font30Leading110 font-semibold lg:mb-[49px] lg:block lg:text-[105px]'>
            {t('title_2')}
          </h2>
          <h3 className='text-[22px] leading-[120%] opacity-[33%]'>
            {t('subtitle')}
          </h3>
          <div className='mt-[20px] flex justify-center gap-4 lg:mt-5'>
            <StoreButtons theme='light' />
          </div>
        </div>
      </div>
    </section>
  );
}
