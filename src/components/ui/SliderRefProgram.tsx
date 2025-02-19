'use client';

import { Slider } from '@heroui/react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function SliderRefProgram() {
  const t = useTranslations('referralPage.howItWorks');

  const [UserValue, setUserValue] = useState<number>(10);

  const [VolumeValue, setVolumeValue] = useState<number>(100);

  const income = Math.floor((VolumeValue / 1000) * 25 * UserValue);

  const handleUserValueChange = (value: number | number[]) => {
    if (Array.isArray(value)) {
      setUserValue(value[0]); // Если это массив, берем первое значение
    } else {
      setUserValue(value); // Если это число, просто устанавливаем его
    }
  };

  // Обработчик изменения для VolumeValue
  const handleVolumeValueChange = (value: number | number[]) => {
    if (Array.isArray(value)) {
      setVolumeValue(value[0]); // Если это массив, берем первое значение
    } else {
      setVolumeValue(value); // Если это число, просто устанавливаем его
    }
  };

  return (
    <div className='space-y-16'>
      <div className='flex w-full flex-col-reverse items-center justify-between gap-2 md:gap-4 lg:flex-row lg:gap-8'>
        <div className='w-full lg:w-3/4'>
          <div className='space-y-4'>
            <h2 className='text-[13px] font-semibold leading-[120%] md:text-[20px]'>
              {t('slider_title_1')}
            </h2>
            <p className='text-[40px] font-bold leading-[125%] tracking-tight'>
              {UserValue}
            </p>
          </div>
          <Slider
            className='max-w-full'
            defaultValue={10}
            maxValue={100}
            //label={t('slider_title_1')}
            showOutline={true}
            onChange={handleUserValueChange}
            color='danger'
            renderThumb={(props) => (
              <div
                {...props}
                className='border-small border-default-200 shadow-medium bg-danger group top-1/2 cursor-grab rounded-full p-1 data-[dragging=true]:cursor-grabbing'
              >
                <span className='shadow-small group-data-[dragging=true]:scale-80 block h-5 w-5 rounded-full bg-gradient-to-br from-slate-500 to-slate-800 transition-transform' />
              </div>
            )}
            minValue={1}
            step={1}
            size='sm'
          />
        </div>
        <div className='my-[25px] w-full border-t border-black/30 opacity-[20%] lg:hidden'></div>
        <div className='flex w-full flex-row items-center justify-between lg:w-1/4 lg:flex-col'>
          <h2 className='text-[13px] font-semibold leading-[120%] md:text-[20px]'>
            {t('bonusPercentage_title')}
          </h2>
          <p className='text-[24px] font-semibold md:text-[40px] md:tracking-tight lg:text-font70Leading110'>
            {t('bonusPercentage')}
          </p>
        </div>
        <div className='flex w-full flex-row items-center justify-between lg:hidden'>
          <h2 className='text-[13px] font-semibold leading-[120%] md:text-[20px]'>
            {t('income')}
          </h2>
          <p className='text-danger text-[24px] font-semibold md:text-[40px] md:tracking-tight lg:text-font70Leading110'>
            {income} USDT
          </p>
        </div>
      </div>
      <div className='flex w-full items-center justify-between gap-2 md:gap-4 lg:gap-8'>
        <div className='w-full lg:w-3/4'>
          <div className='space-y-4'>
            <h2 className='text-[13px] font-semibold leading-[120%] md:text-[20px]'>
              {t('slider_title_2')}
            </h2>
            <p className='text-[40px] font-bold leading-[125%] tracking-tight'>
              {VolumeValue}
            </p>
          </div>
          <Slider
            className='max-w-full'
            defaultValue={100}
            maxValue={10000}
            //label={t('slider_title_1')}
            showOutline={true}
            onChange={handleVolumeValueChange}
            color='danger'
            renderThumb={(props) => (
              <div
                {...props}
                className='border-small border-default-200 shadow-medium bg-danger group top-1/2 cursor-grab rounded-full p-1 data-[dragging=true]:cursor-grabbing'
              >
                <span className='shadow-small group-data-[dragging=true]:scale-80 block h-5 w-5 rounded-full bg-gradient-to-br from-slate-500 to-slate-800 transition-transform' />
              </div>
            )}
            minValue={0}
            step={1}
            size='sm'
          />
        </div>
        <div className='hidden w-1/4 flex-col items-center justify-between lg:flex'>
          <h2 className='text-[13px] font-semibold leading-[120%] md:text-[20px]'>
            {t('income')}
          </h2>
          <p className='text-danger text-[24px] font-semibold md:text-[40px] md:tracking-tight lg:text-font70Leading110'>
            {income}
          </p>
        </div>
      </div>
    </div>
  );
}
