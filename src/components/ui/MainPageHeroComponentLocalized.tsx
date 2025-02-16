'use client';

import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { i18n, Locale } from '@/i18n.config';
import StoreButtons from '@/components/ui/StoreButtons';

export default function HeroMainPage() {
  const t = useTranslations('mainPage.hero');
  const localeFromHook = useLocale();
  const currentLocale: Locale = i18n.locales.includes(localeFromHook as Locale)
    ? (localeFromHook as Locale)
    : i18n.defaultLocale;

  const topPositionClasses = {
    en: 'lg:left-[23%] lg:-top-[46%] xl:-top-[50%] 2xl:left-[25%]', // Для английской локализации
    ru: 'lg:left-[23%] lg:-top-[40%] xl:-top-[44%] 2xl:left-[25%]', // Для русской локализации
    ua: 'lg:left-[23%] lg:-top-[46%] xl:-top-[50%] 2xl:left-[25%]', // Для украинской локализации
  };

  const imageMap: { [key in Locale]: { src: string; alt: string } } = {
    en: { src: '/hero_main_page_rocks.png', alt: 'Hero Image' },
    ru: { src: '/hero_main_page_rocks.png', alt: 'Hero Image' },
    ua: { src: '/hero_main_page_rocks.png', alt: 'Hero Image' },
  };

  // Выбираем данные для изображения
  const imageData = imageMap[currentLocale] || {
    src: '/hero_main_page_rocks.png',
    alt: 'Hero Image',
  };

  const topPosition =
    topPositionClasses[currentLocale] ||
    'lg:left-[23%] lg:-top-[46%] xl:-top-[50%] 2xl:left-[25%]';

  // Устанавливаем соответствующие классы для изображения hero_main_page_rocks в зависимости от локализации
  const heroImageClasses = {
    en: 'relative h-[630px] w-full object-cover sm:h-[951px] sm:w-full md:h-[840px] md:w-[1070px] lg:h-[940px] lg:w-[1120px] xl:h-[1140px] xl:w-[1268px]',
    ru: 'relative h-[630px] w-full object-cover sm:h-[951px] sm:w-full md:h-[840px] md:w-[1070px] lg:h-[940px] lg:w-[1120px] xl:h-[1140px] xl:w-[1268px]',
    ua: 'relative h-[630px] w-full object-cover sm:h-[951px] sm:w-full md:h-[840px] md:w-[1070px] lg:h-[940px] lg:w-[1120px] xl:h-[1140px] xl:w-[1268px]',
  };

  const heroImageClass = heroImageClasses[currentLocale] || heroImageClasses.en;

  return (
    <div className='gap-2 lg:flex'>
      <div className='relative z-30'>
        <div className='lg:w-[650px]'>
          <h1 className='text-font30Leading110 md:text-font50Leading110 lg:text-font70Leading110'>
            {t('title')}{' '}
            <span className='bg-gradient-to-r from-[#FFC996] via-[#FD6B06] to-[#963706] bg-clip-text text-transparent'>
              {t('subtitle')}
            </span>
          </h1>
        </div>
        <div className='mt-[20px] lg:mt-[186px] lg:w-[435px] lg:rounded-lg lg:bg-gradient-to-r lg:from-[#553300] lg:to-[#FE9900] lg:p-[1px]'>
          <div className='lg:bg-black lg:px-[25px] lg:py-6 xl:rounded-lg'>
            <p className='my-[25px] text-[13px] font-medium leading-[130%] opacity-[30%] md:text-font16Leading110 lg:mt-0 lg:max-w-3xl lg:text-primary lg:font-semibold lg:opacity-100'>
              {t('text_button')}
            </p>
            <div className='lg:border-t lg:opacity-[33%] xl:my-6'></div>
            <div className='grid grid-cols-2 gap-4'>
              <StoreButtons theme='dark' />
            </div>
          </div>
        </div>
      </div>

      <div className='pointer-events-none absolute -top-20 right-0 z-10 w-[265px] sm:-top-28 sm:w-[365px] lg:hidden'>
        <Image
          src='/hero_main_page_ellipse.png'
          alt='Hero image'
          width={1172}
          height={1094}
          className='relative w-full rotate-90 object-fill md:w-[415px] xl:w-[1172px]'
          priority={true}
        />
      </div>
      <div
        className={`pointer-events absolute left-0 top-[50%] z-20 w-screen overflow-hidden sm:-left-[5%] sm:top-12 md:-left-[25%] md:top-[55%] md:w-[1070px] lg:w-full ${topPosition} 2xl:w-full`}
      >
        <Image
          src={imageData.src}
          alt={imageData.alt}
          width={1268}
          height={951}
          className={heroImageClass}
          priority={true}
        />
      </div>
      <div className='pointer-events-none absolute left-[50%] top-[100%] z-10 w-[270px] -translate-x-[50%] sm:top-[130%] sm:w-[350px] md:top-[115%] lg:-top-28 lg:left-[75%] lg:w-[400px] xl:-top-32 xl:w-[500px] 2xl:left-[68%]'>
        <Image
          src='/hero_main_page_webp.webp'
          alt='Hero image'
          width={800}
          height={1200}
          className='relative h-[396px] w-[270px] object-fill sm:h-[496px] sm:w-[350px] md:h-[500px] md:w-[350px] lg:h-[600px] lg:w-[400px] xl:h-[750px] xl:w-[500px]'
          priority={true}
        />
      </div>
      <div className='pointer-events-none absolute -left-[16%] top-[60%] z-10 w-screen md:-left-[15%] md:top-[25%] lg:-top-[50%] lg:left-[75%] lg:w-[900px]'>
        <Image
          src='/hero_main_page_ellipse.png'
          alt='Hero image'
          width={1172}
          height={1094}
          className='relative w-[265px] rotate-180 object-cover sm:w-[365px] md:w-[415px] lg:w-[900px] lg:rotate-0'
          priority={true}
        />
      </div>
    </div>
  );
}
