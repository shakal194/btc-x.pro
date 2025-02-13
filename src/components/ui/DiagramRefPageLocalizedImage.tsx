'use client';

import Image from 'next/image';
import { useLocale } from 'next-intl';
import { i18n, Locale } from '@/i18n.config';

export default function DiagramRefPageLocalizedImage() {
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
