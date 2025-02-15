'use client';

import { useState } from 'react';
import Notiflix from 'notiflix';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import StoreButtons from '@/components/ui/StoreButtons';

export default function SubscriptionFormPromo() {
  const t = useTranslations('promo');
  const [formData, setFormData] = useState({
    email: '',
    youtube: '',
    telegram: '',
    instagram: '',
    rating: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const response = await fetch('/api/subscribePromo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage(result.message);
        Notiflix.Notify.success(`${t('form_success_message')}`);
        setFormData({
          email: '',
          youtube: '',
          telegram: '',
          instagram: '',
          rating: '',
        });
      } else {
        if (result.error === 'You are already subscribed') {
          Notiflix.Notify.failure(`${t('form_error_already_subscribed')}`);
        } else {
          // Для других ошибок
          setErrorMessage(result.error || 'Error sending email');
          Notiflix.Notify.failure(
            `${t('form_error_message')}` || 'Error sending email',
          );
        }
      }
    } catch (error: unknown) {
      setErrorMessage('An error occurred while subscribing');
      // Проверка типа ошибки
      if (error instanceof Error) {
        Notiflix.Notify.failure(`${t('form_error_message')}` || error.message);
      } else {
        Notiflix.Notify.failure('An unknown error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className='rounded-2xl border border-orange-500 p-4 lg:p-10'
      id='subscription-form'
      onSubmit={handleSubmit}
    >
      <div className='grid grid-cols-1 gap-2 md:gap-4 lg:gap-8'>
        {/* Левая колонка - нумерация и текст */}
        <div className='grid gap-8'>
          <div className='grid grid-cols-1 items-center gap-2 md:gap-4 xl:grid-cols-2'>
            <div className='grid grid-cols-7 items-center gap-2 md:flex md:gap-4 lg:gap-8 xl:grid xl:grid-cols-8'>
              <div className='flex h-[40px] w-[40px] items-center justify-center rounded-full border border-white/30 lg:h-[65px] lg:w-[65px]'>
                <p className='text-font18Leading130 lg:text-font30Leading130'>
                  01
                </p>
              </div>
              <div className='col-span-6'>
                <label className='text-font18Leading130 lg:text-font30Leading130'>
                  {t('form_label_1')}
                </label>
              </div>
            </div>
            <div className='grid grid-cols-2 items-center gap-2 md:gap-4 lg:gap-8'>
              <StoreButtons theme='dark' />
            </div>
          </div>
          {/* Далее аналогичные поля для других данных */}
          <div className='grid grid-cols-1 items-center gap-2 md:gap-4 xl:grid-cols-2'>
            <div className='flex items-center gap-2 md:gap-4 lg:gap-8'>
              <div className='flex h-[40px] w-[40px] items-center justify-center rounded-full border border-white/30 lg:h-[65px] lg:w-[65px]'>
                <p className='text-font18Leading130 lg:text-font30Leading130'>
                  02
                </p>
              </div>
              <div>
                <label className='text-font18Leading130 lg:mb-[20px] lg:text-font30Leading130'>
                  {t('form_label_2')}
                </label>
                <p className='text-gray-400'>{t('form_title_2')}</p>
              </div>
            </div>
            <div className='grid grid-cols-1 items-center gap-2 md:grid-cols-2 md:gap-4 lg:gap-8'>
              <input
                type='text'
                name='youtube'
                value={formData.youtube}
                onChange={handleChange}
                placeholder={t('form_placeholder_2')}
                className='w-full rounded border border-gray-600 bg-gray-800 p-2 md:w-[350px]'
                required
              />
              <div>
                <Link
                  href='https://www.youtube.com/@BTC-X'
                  target='_blank'
                  className='block w-full cursor-pointer rounded-lg border-none bg-[#ff6600] p-[10px] text-center hover:bg-[#FD6B06] hover:text-black focus:bg-[#FD6B06] focus:text-black lg:w-[300px]'
                >
                  {t('form_link_2')}
                </Link>
              </div>
            </div>
          </div>

          {/* Добавляем другие шаги, используя аналогичную структуру */}
          {/* Пример для поля telegram */}
          <div className='grid grid-cols-1 items-center gap-2 md:gap-4 xl:grid-cols-2'>
            <div className='flex items-center gap-2 md:gap-4 lg:gap-8'>
              <div className='flex h-[40px] w-[40px] items-center justify-center rounded-full border border-white/30 lg:h-[65px] lg:w-[65px]'>
                <p className='text-font18Leading130 lg:text-font30Leading130'>
                  03
                </p>
              </div>
              <div>
                <label className='text-font18Leading130 lg:mb-[20px] lg:text-font30Leading130'>
                  {t('form_label_3')}
                </label>
                <p className='text-gray-400'>{t('form_title_2')}</p>
              </div>
            </div>
            <div className='grid grid-cols-1 items-center gap-2 md:grid-cols-2 md:gap-4 lg:gap-8'>
              <input
                type='text'
                name='telegram'
                value={formData.telegram}
                onChange={handleChange}
                placeholder={t('form_placeholder_3')}
                className='w-full rounded border border-gray-600 bg-gray-800 p-2 md:w-[350px]'
                required
              />
              <div>
                <Link
                  href='https://t.me/+7_3pToHuJwJhZTVi'
                  target='_blank'
                  className='block w-full cursor-pointer rounded-lg border-none bg-[#ff6600] p-[10px] text-center hover:bg-[#FD6B06] hover:text-black focus:bg-[#FD6B06] focus:text-black lg:w-[300px]'
                >
                  {t('form_link_3')}
                </Link>
              </div>
            </div>
          </div>

          {/* Поле для Instagram */}
          <div className='grid grid-cols-1 items-center gap-2 md:gap-4 xl:grid-cols-2'>
            <div className='flex items-center gap-2 md:gap-4 lg:gap-8'>
              <div className='flex h-[40px] w-[40px] items-center justify-center rounded-full border border-white/30 lg:h-[65px] lg:w-[65px]'>
                <p className='text-font18Leading130 lg:text-font30Leading130'>
                  04
                </p>
              </div>
              <div>
                <label className='text-font18Leading130 lg:text-font30Leading130'>
                  {t('form_label_4')}
                </label>
                <p className='text-gray-400'>{t('form_title_2')}</p>
              </div>
            </div>
            <div className='grid grid-cols-1 items-center gap-2 md:grid-cols-2 md:gap-4 lg:gap-8'>
              <input
                type='text'
                name='instagram'
                value={formData.instagram}
                onChange={handleChange}
                placeholder={t('form_placeholder_4')}
                className='w-full rounded border border-gray-600 bg-gray-800 p-2 md:w-[350px]'
                required
              />
              <div>
                <Link
                  href='https://www.instagram.com/btc_x.pro'
                  target='_blank'
                  className='block w-full cursor-pointer rounded-lg border-none bg-[#ff6600] p-[10px] text-center hover:bg-[#FD6B06] hover:text-black focus:bg-[#FD6B06] focus:text-black lg:w-[300px]'
                >
                  {t('form_link_4')}
                </Link>
              </div>
            </div>
          </div>

          {/* Поле для Rating */}
          <div className='grid grid-cols-1 items-center gap-2 md:gap-4 xl:grid-cols-2'>
            <div className='flex items-center gap-2 md:gap-4 lg:gap-8'>
              <div className='flex h-[40px] w-[40px] items-center justify-center rounded-full border border-white/30 lg:h-[65px] lg:w-[65px]'>
                <p className='text-font18Leading130 lg:text-font30Leading130'>
                  05
                </p>
              </div>
              <div>
                <label className='text-font18Leading130 lg:text-font30Leading130'>
                  {t('form_label_5')}
                </label>
                <p className='text-gray-400'>{t('form_title_2')}</p>
              </div>
            </div>
            <div className='grid grid-cols-1 items-center gap-2 md:grid-cols-2 md:gap-4 lg:gap-8'>
              <input
                type='text'
                name='rating'
                value={formData.rating}
                onChange={handleChange}
                placeholder={t('form_placeholder_5')}
                className='w-full rounded border border-gray-600 bg-gray-800 p-2 md:w-[350px]'
                required
              />
              <div>
                <Link
                  href='https://onelink.to/js2s8h'
                  target='_blank'
                  className='block w-full cursor-pointer rounded-lg border-none bg-[#ff6600] p-[10px] text-center hover:bg-[#FD6B06] hover:text-black focus:bg-[#FD6B06] focus:text-black lg:w-[300px]'
                >
                  {t('form_link_5')}
                </Link>
              </div>
            </div>
          </div>

          {/* Пример для кнопки отправки формы */}
          <div className='grid grid-cols-1 items-center gap-2 md:gap-4 xl:grid-cols-2'>
            <div className='flex items-center gap-2 md:gap-4 lg:gap-8'>
              <div className='flex h-[40px] w-[40px] items-center justify-center rounded-full border border-white/30 lg:h-[65px] lg:w-[65px]'>
                <p className='text-font18Leading130 lg:text-font30Leading130'>
                  06
                </p>
              </div>
              <div>
                <label className='text-font18Leading130 lg:text-font30Leading130'>
                  {t('form_label_6')}
                </label>
              </div>
            </div>
            <div className='grid grid-cols-1 items-center gap-2 md:grid-cols-2 md:gap-4 lg:gap-8'>
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                placeholder={t('form_placeholder_6')}
                className='w-full rounded border border-gray-600 bg-gray-800 p-2 md:w-[350px]'
                required
              />
              <div>
                <button
                  type='submit'
                  className='block w-full cursor-pointer rounded-lg border-none bg-[#ff6600] p-[10px] text-center hover:bg-[#FD6B06] hover:text-black focus:bg-[#FD6B06] focus:text-black lg:w-[300px]'
                >
                  {t('form_button_6')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
