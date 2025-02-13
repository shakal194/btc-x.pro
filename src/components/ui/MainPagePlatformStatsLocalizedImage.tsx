'use client';

import Image from 'next/image';
import { useLocale } from 'next-intl';
import { i18n, Locale } from '@/i18n.config';

export function TradePowerLocalizedImage() {
  const localeFromHook = useLocale();

  // Приводим locale к типу Locale, если он входит в i18n.locales,
  // иначе используем дефолтную локаль.
  const currentLocale: Locale = i18n.locales.includes(localeFromHook as Locale)
    ? (localeFromHook as Locale)
    : i18n.defaultLocale;

  const imageMap: { [key in Locale]: { src: string; alt: string } } = {
    en: { src: '/trade_power_en.png', alt: 'Trade power' },
    ru: { src: '/trade_power_ru.png', alt: 'Торговая мощность' },
    ua: { src: '/trade_power_ua.png', alt: 'Торгова потужність' },
  };

  // Выбираем данные для изображения
  const imageData = imageMap[currentLocale] || {
    src: '/trade_power_en.png',
    alt: 'Trade power',
  };

  return (
    <div>
      <Image
        src={imageData.src}
        alt={imageData.alt}
        width={630}
        height={290}
        className='w-full'
      />
    </div>
  );
}

export function FreeComissionLocalizedImage() {
  const localeFromHook = useLocale();

  // Приводим locale к типу Locale, если он входит в i18n.locales,
  // иначе используем дефолтную локаль.
  const currentLocale: Locale = i18n.locales.includes(localeFromHook as Locale)
    ? (localeFromHook as Locale)
    : i18n.defaultLocale;

  const imageMap: { [key in Locale]: { src: string; alt: string } } = {
    en: { src: '/free_comission_en.png', alt: '0% comission' },
    ru: { src: '/free_comission_ru.png', alt: '0% комиссия' },
    ua: { src: '/free_comission_ua.png', alt: '0% комісія' },
  };

  // Выбираем данные для изображения
  const imageData = imageMap[currentLocale] || {
    src: '/free_comission_en.png',
    alt: '0% comission',
  };

  return (
    <div>
      <Image
        src={imageData.src}
        alt={imageData.alt}
        width={630}
        height={290}
        className='w-full'
      />
    </div>
  );
}
