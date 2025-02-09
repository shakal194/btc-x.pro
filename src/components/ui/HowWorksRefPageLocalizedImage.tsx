'use client';

import Image from 'next/image';
import { useLocale } from 'next-intl';
import { i18n, Locale } from '@/i18n.config';

export default function HowWorksRefPageLocalizedImage() {
  const localeFromHook = useLocale();

  // Приводим locale к типу Locale, если он входит в i18n.locales,
  // иначе используем дефолтную локаль.
  const currentLocale: Locale = i18n.locales.includes(localeFromHook as Locale)
    ? (localeFromHook as Locale)
    : i18n.defaultLocale;

  const imageMap: { [key in Locale]: { src: string; alt: string } } = {
    en: { src: '/ref_program_mockup_en.png', alt: 'Hero Image' },
    ru: { src: '/ref_program_mockup_ru.png', alt: 'Hero Image' },
    ua: { src: '/ref_program_mockup_ua.png', alt: 'Hero Image' },
  };

  // Выбираем данные для изображения
  const imageData = imageMap[currentLocale] || {
    src: '/ref_program_mockup_en.png',
    alt: 'Hero Image',
  };

  return (
    <div>
      <Image
        src={imageData.src}
        alt={imageData.alt}
        width={2158}
        height={1282}
        className='hidden h-[550px] w-[630px] lg:block lg:h-auto lg:w-auto'
      />
    </div>
  );
}
