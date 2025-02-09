'use client';

import Image from 'next/image';
import { useLocale } from 'next-intl';
import { i18n, Locale } from '@/i18n.config';

export default function HeroRefPageLocalizedImage() {
  const localeFromHook = useLocale();

  // Приводим locale к типу Locale, если он входит в i18n.locales,
  // иначе используем дефолтную локаль.
  const currentLocale: Locale = i18n.locales.includes(localeFromHook as Locale)
    ? (localeFromHook as Locale)
    : i18n.defaultLocale;

  const imageMap: { [key in Locale]: { src: string; alt: string } } = {
    en: { src: '/hero_referral_en.png', alt: 'Referral program' },
    ru: { src: '/hero_referral_ru.png', alt: 'Referral program' },
    ua: { src: '/hero_referral_ua.png', alt: 'Referral program' },
  };

  // Выбираем данные для изображения
  const imageData = imageMap[currentLocale] || {
    src: '/hero_referral_en.png',
    alt: 'Referral program',
  };

  return (
    <div>
      <Image
        src={imageData.src}
        alt={imageData.alt}
        width={2158}
        height={1282}
        className='relative hidden lg:block'
      />
    </div>
  );
}
