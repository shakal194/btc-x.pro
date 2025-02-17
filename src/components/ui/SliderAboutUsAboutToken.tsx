'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css'; // Импортируем стили Swiper
import 'swiper/css/bundle'; // Импортируем стили Swiper
import { useTranslations } from 'next-intl';

export default function SliderAboutUsAboutToken() {
  const t = useTranslations('airdrop.aboutToken');
  const sliderTexts = new Array(5).fill('btcxt');

  return (
    <Swiper
      loop={true}
      autoplay={true}
      modules={[Autoplay]}
      breakpoints={{
        320: { slidesPerView: 1.0 },
        380: {
          slidesPerView: 1.5,
        },
        480: {
          slidesPerView: 2.0,
        },
        640: {
          slidesPerView: 2.25,
        },
        768: {
          slidesPerView: 1.8,
        },
        1280: {
          slidesPerView: 2.2,
        },
        1536: {
          slidesPerView: 2.7,
        },
      }}
      className='absolute top-0 md:-top-1/4 lg:-top-[70%] xl:-top-full'
    >
      {sliderTexts.map((text, index) => (
        <SwiperSlide key={index}>
          <h1 className='text-[75px] font-bold opacity-[10%] md:text-[125px] lg:text-[170px]'>
            {t(text)}
          </h1>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
