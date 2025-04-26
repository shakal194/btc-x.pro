'use client';

import { Slider } from '@heroui/react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function SliderCloudMiningProgram() {
  const t = useTranslations('cloudMiningPage.howItWorks');

  const [HashRate, setHashRateValue] = useState<number>(100);

  const price = 0.04;

  const income = Math.floor(price * HashRate);

  const handleUserValueChange = (value: number | number[]) => {
    if (Array.isArray(value)) {
      setHashRateValue(value[0]); // Если это массив, берем первое значение
    } else {
      setHashRateValue(value); // Если это число, просто устанавливаем его
    }
  };

  return (
    <div className='space-y-16'>
      <div className='flex w-full flex-col-reverse items-center justify-between gap-2 md:gap-4 lg:flex-row lg:gap-8'>
        <div className='w-full lg:w-3/4'>
          <div className='space-y-4'>
            <h2 className='text-[13px] font-semibold leading-[120%] md:text-[20px]'>
              {t('slider_title_1')} ( {t('revenue')})
            </h2>
            <p className='text-[40px] font-bold leading-[125%] tracking-tight'>
              {HashRate}
            </p>
          </div>
          <Slider
            label={t('title_2')}
            className='max-w-full'
            defaultValue={100}
            maxValue={1000}
            showOutline={true}
            onChange={handleUserValueChange}
            color='secondary'
            renderThumb={(props) => (
              <div
                {...props}
                className='group top-1/2 cursor-grab rounded-full border-small border-default-200 bg-secondary p-1 shadow-medium data-[dragging=true]:cursor-grabbing'
              >
                <span className='block h-5 w-5 rounded-full bg-gradient-to-br from-slate-500 to-slate-800 shadow-small transition-transform group-data-[dragging=true]:scale-80' />
              </div>
            )}
            minValue={1}
            step={1}
            size='sm'
          />
        </div>
        <div className='my-[25px] w-full border-t border-black/30 opacity-[20%] lg:hidden'></div>

        <div className='flex w-full items-center justify-between gap-2 md:gap-4 lg:w-1/4 lg:gap-8'>
          <div className='hidden flex-col items-center justify-between lg:flex'>
            <h2 className='text-[13px] font-semibold leading-[120%] md:text-[20px]'>
              {t('income')}
            </h2>
            <p className='text-[10px] text-black/50'>{t('income_2')}</p>
            <p className='text-[24px] font-semibold text-secondary md:text-[40px] md:tracking-tight lg:text-font70Leading110'>
              {income}
            </p>
          </div>
        </div>
        <div className='flex w-full flex-row items-center justify-between lg:hidden'>
          <div>
            <h2 className='text-[13px] font-semibold leading-[120%] md:text-[20px]'>
              {t('income')}
            </h2>
            <p className='text-[10px] text-black/50'>{t('income_2')}</p>
          </div>
          <p className='text-[24px] font-semibold text-secondary md:text-[40px] md:tracking-tight lg:text-font70Leading110'>
            {income} USDT
          </p>
        </div>
      </div>
    </div>
  );
}
