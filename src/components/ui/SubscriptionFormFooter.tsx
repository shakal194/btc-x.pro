'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Notiflix from 'notiflix';
import FullScreenSpinner from '@/components/ui/Spinner';

export default function SubscriptionFormFooter() {
  const t = useTranslations('footer');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage(result.message);
        Notiflix.Notify.success(`${t('form_success_message')}`);
        setEmail('');
      } else {
        // Если ошибка "You are already subscribed"
        if (result.error === 'You are already subscribed') {
          Notiflix.Notify.failure(`${t('form_error_already_subscribed')}`);
        } else {
          // Для других ошибок
          setErrorMessage(result.error || `${t('form_error_default')}`);
          Notiflix.Notify.failure(
            `${t('form_error_message')}` || `${t('form_error_default')}`,
          );
        }
      }
    } catch (error: unknown) {
      setErrorMessage('An error occurred while subscribing');
      // Проверка типа ошибки
      if (error instanceof Error) {
        Notiflix.Notify.failure(`${t('form_error_message')}` || error.message);
      } else {
        Notiflix.Notify.failure(`${t('form_error_unknown')}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {isSubmitting && <FullScreenSpinner />}
      <form
        className='relative z-10 mx-auto flex flex-col items-center justify-center gap-4 p-[5px] md:w-[550px] md:flex-row md:justify-between md:rounded-full md:border md:border-gray-700 lg:absolute lg:bottom-0 lg:right-0 lg:w-[540px] lg:backdrop-blur-md xl:w-[650px] xl:p-[10px]'
        onSubmit={handleSubmit}
      >
        <input
          type='email'
          placeholder={t('subscribe_placeholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='w-full rounded-full border border-gray-700 bg-black px-4 py-2 text-white focus:outline-none focus:ring sm:w-80 md:w-52 md:border-none xl:w-72'
          required
        />
        <button
          type='submit'
          className='w-full rounded-full bg-white px-6 py-2 font-bold text-black transition delay-200 hover:bg-[#FD6B06] hover:text-white focus:bg-[#FD6B06] focus:text-white focus:outline-none focus:ring sm:w-80 md:w-auto'
          disabled={isSubmitting}
        >
          {isSubmitting
            ? t('subscribe_button_submitted')
            : t('subscribe_button')}
        </button>
      </form>
    </>
  );
}
