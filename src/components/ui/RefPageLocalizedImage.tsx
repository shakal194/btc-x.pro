'use client';

import Image from 'next/image';
import { useLocale } from 'next-intl';
import { i18n, Locale } from '@/i18n.config';
/*
export function HeroRefPageLocalizedImage() {
  const localeFromHook = useLocale();

  // Приводим locale к типу Locale, если он входит в i18n.locales,
  // иначе используем дефолтную локаль.
  const currentLocale: Locale = i18n.locales.includes(localeFromHook as Locale)
    ? (localeFromHook as Locale)
    : i18n.defaultLocale;

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
}*/

export function HowWorksRefPageLocalizedImage() {
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

export function DiagramRefPageLocalizedImage() {
  const localeFromHook = useLocale();

  // Приводим locale к типу Locale, если он входит в i18n.locales,
  // иначе используем дефолтную локаль.
  const currentLocale: Locale = i18n.locales.includes(localeFromHook as Locale)
    ? (localeFromHook as Locale)
    : i18n.defaultLocale;

  const imageMap: { [key in Locale]: { src: string; alt: string } } = {
    en: { src: '/ref_program_diagram_en.png', alt: 'Referral program' },
    ru: { src: '/ref_program_diagram_ru.png', alt: 'Referral program' },
    ua: { src: '/ref_program_diagram_ua.png', alt: 'Referral program' },
  };

  // Выбираем данные для изображения
  const imageData = imageMap[currentLocale] || {
    src: '/ref_program_diagram_en.png',
    alt: 'Referral program',
  };

  return (
    <div>
      <Image src={imageData.src} alt={imageData.alt} width={630} height={495} />
    </div>
  );
}
