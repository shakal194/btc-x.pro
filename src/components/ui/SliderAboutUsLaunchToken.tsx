'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { useLocale } from 'next-intl';
import { i18n, Locale } from '@/i18n.config';
import 'swiper/css'; // Импортируем стили Swiper
import 'swiper/css/bundle'; // Импортируем стили Swiper
import { useTranslations } from 'next-intl';

export default function SliderAboutUsLaunchToken() {
  const t = useTranslations('airdrop.launchingToken');
  const sliderTexts = new Array(5).fill('slider_text');

  const localeFromHook = useLocale();
  const currentLocale: Locale = i18n.locales.includes(localeFromHook as Locale)
    ? (localeFromHook as Locale)
    : i18n.defaultLocale;

  const swiperBreakpoints = {
    en: {
      320: { slidesPerView: 1.0 },
      380: {
        slidesPerView: 1.5,
      },
      480: {
        slidesPerView: 2.0,
      },
      640: {
        slidesPerView: 2.5,
      },
      768: {
        slidesPerView: 3.0,
      },
      1024: {
        slidesPerView: 2.5,
      },
      1280: {
        slidesPerView: 3.5,
      },
      1536: {
        slidesPerView: 4,
      },
    },
    ru: {
      320: { slidesPerView: 1.0 },
      380: {
        slidesPerView: 1.25,
      },
      480: {
        slidesPerView: 1.5,
      },
      640: {
        slidesPerView: 2.0,
      },
      768: {
        slidesPerView: 2.5,
      },
      1024: {
        slidesPerView: 2.15,
      },
      1280: {
        slidesPerView: 2.75,
      },
      1536: {
        slidesPerView: 3.15,
      },
    },
    ua: {
      320: { slidesPerView: 1.0 },
      380: {
        slidesPerView: 1.5,
      },
      480: {
        slidesPerView: 2.0,
      },
      640: {
        slidesPerView: 2.5,
      },
      768: {
        slidesPerView: 3.0,
      },
      1024: {
        slidesPerView: 2.55,
      },
      1280: {
        slidesPerView: 3.25,
      },
      1536: {
        slidesPerView: 3.75,
      },
    },
  };

  // Get the breakpoints for the current locale
  const currentBreakpoints =
    swiperBreakpoints[currentLocale] || swiperBreakpoints.en;

  return (
    <Swiper
      // install Swiper modules
      slidesPerView={3}
      loop={true}
      autoplay={true}
      modules={[Autoplay]}
      breakpoints={currentBreakpoints}
    >
      {sliderTexts.map((text, index) => (
        <SwiperSlide key={index}>
          <h1 className='text-center text-font18Leading130 text-white/30 lg:text-font30Leading130'>
            {t(text)}
          </h1>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
