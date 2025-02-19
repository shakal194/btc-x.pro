'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useState, useEffect, useRef } from 'react';

export default function OurPlatformSection() {
  const t = useTranslations('mainPage.ourPlatform');

  const [isVisible, setIsVisible] = useState(false);

  // Ссылки на части текста
  const textRef = useRef<HTMLDivElement | null>(null);

  const wordsTitle = t('title').split(' ');

  // Настроим IntersectionObserver для отслеживания видимости
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
        });
      },
      { threshold: 0.5 }, // 15% элемента должно быть видно
    );

    const currentRef = textRef.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <section className='relative z-30 mt-[555px] md:mt-[785px] lg:mt-0 lg:py-[100px]'>
      <div className='container mx-auto px-4 text-center'>
        <p
          className='flex flex-wrap items-center justify-center whitespace-pre text-primary leading-[125%] tracking-tight transition-colors duration-300 lg:text-[40px]'
          ref={textRef}
        >
          {wordsTitle.map((word, index) => (
            <span
              key={index}
              className={`transition-colors duration-300 ${
                isVisible ? 'text-white' : 'text-white/30'
              }`}
              style={{
                transitionDelay: `${index * 0.05}s`, // Задержка для каждого слова
              }}
            >
              {word}{' '}
            </span>
          ))}
          <span className='relative ml-4 mt-2 flex items-center justify-start lg:mb-0'>
            <Image
              src='/binance_icon.png'
              alt='Binance'
              width={45}
              height={45}
              className='relative z-10 -ml-2'
            />
            <Image
              src='/okx_icon.png'
              alt='OKX'
              width={45}
              height={45}
              className='relative z-20 -ml-3'
            />
            <Image
              src='/coinbase_icon.png'
              alt='Coinbase'
              width={45}
              height={45}
              className='relative z-30 -ml-3'
            />
          </span>
        </p>
      </div>
    </section>
  );
}
