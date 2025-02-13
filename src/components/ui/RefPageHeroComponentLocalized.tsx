import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { i18n, Locale } from '@/i18n.config';
import StoreButtons from '@/components/ui/StoreButtons';

export default function HeroRefPage() {
  const t = useTranslations('referralPage.hero');
  const localeFromHook = useLocale();
  const currentLocale: Locale = i18n.locales.includes(localeFromHook as Locale)
    ? (localeFromHook as Locale)
    : i18n.defaultLocale;

  const widthClasses = {
    en: 'w-[400px] sm:w-full lg:w-[600px] xl:w-[750px] 2xl:w-[700px]', // Для английской локализации
    ru: 'w-[350px] sm:w-full lg:w-[700px] xl:w-[1000px]', // Для русской локализации
    ua: 'w-[300px] sm:w-full lg:w-[700px] xl:w-[1000px]', // Для украинской локализации
  };

  const topPositionClasses = {
    en: 'lg:top-[33%]', // Для английской локализации
    ru: 'lg:top-[45%] 2xl:top-[32%]', // Для русской локализации
    ua: 'lg:top-[45%] 2xl:top-[32%]', // Для украинской локализации
  };

  const imageMap: { [key in Locale]: { src: string; alt: string } } = {
    en: { src: '/hero_referral_en.png', alt: 'Hero Image' },
    ru: { src: '/hero_referral_ru.png', alt: 'Hero Image' },
    ua: { src: '/hero_referral_ua.png', alt: 'Hero Image' },
  };

  // Выбираем данные для изображения
  const imageData = imageMap[currentLocale] || {
    src: '/hero_referral_en.png',
    alt: 'Hero Image',
  };

  // Выбираем соответствующие классы в зависимости от локализации
  const containerWidth =
    widthClasses[currentLocale] ||
    'w-[300px] sm:w-full lg:w-[600px] 2xl:w-[700px]';
  const topPosition = topPositionClasses[currentLocale] || 'lg:top-[33%]';

  return (
    <div className='flex'>
      <div className='z-20'>
        <div className={` ${containerWidth}`}>
          <h1 className='text-font30Leading110 lg:text-font50Leading110 xl:text-font70Leading110'>
            {t('title')}{' '}
            <span className='bg-gradient-to-r from-[#FFC996] via-[#FD6B06] to-[#963706] bg-clip-text text-transparent'>
              {t('subtitle')}
            </span>{' '}
            {t('subtitle_2')}
          </h1>
        </div>
        <div className='mt-[62px] lg:w-[435px] xl:mt-[100px]'>
          <p className='w-[238px] text-[13px] font-semibold leading-[130%] text-white/40 md:w-[338px] md:text-primary lg:w-full lg:max-w-3xl lg:text-white'>
            {t('text')} <span className='text-white'>{t('text_2')}</span>{' '}
            {t('text_3')}
          </p>
          <div className='my-6 hidden border-t opacity-[33%] lg:block'></div>
          <div className='mt-[20px] grid grid-cols-2 gap-2 md:gap-4 lg:mt-0 lg:gap-8'>
            <StoreButtons theme='dark' />
          </div>
        </div>
      </div>
      <div
        className={`pointer-events-none absolute left-1/2 z-10 w-full -translate-x-1/2 -translate-y-1/3 ${topPosition}`}
      >
        <Image
          src='/hero_referral_mobile.png'
          alt='Hero Image'
          width={693}
          height={699}
          className='relative h-[699px] w-[693px] sm:hidden'
        />
        <Image
          src='/hero_referral_tablet.png'
          alt='Hero Image'
          width={640}
          height={1350}
          priority={true}
          className='relative hidden h-[800px] w-[640px] sm:block sm:w-full lg:hidden'
        />
        <Image
          src={imageData.src}
          alt={imageData.alt}
          width={2158}
          height={1282}
          className='relative hidden lg:block'
        />
      </div>
    </div>
  );
}
