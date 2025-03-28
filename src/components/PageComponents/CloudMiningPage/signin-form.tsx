'use client';

import {
  AtSymbolIcon,
  KeyIcon,
  EyeIcon,
  EyeSlashIcon,
  XMarkIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

import { authenticate, handleEmailSubmitSign } from '@/lib/actions';
import { useState, useActionState } from 'react';
import React from 'react';
import { Tabs, Tab, Card, CardBody, Link, CardFooter } from '@heroui/react';
import FullScreenSpinner from '@/components/ui/Spinner';
import { Button } from '@/components/button';
import SignUpForm from '@/components/ui/SignUpForm';
import { useTranslations } from 'next-intl';

export default function SignForm() {
  const t = useTranslations('cloudMiningPage.signin');

  const [selected, setSelected] = useState('signin');
  const [errorMessage, dispatch] = useActionState(authenticate, undefined);

  const [errorMessageFormSignin, setErrorMessageSignin] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [stepSignin, setStepSignin] = useState(1); // 1 - Email, 2 - OTP and Password
  const [email, setEmail] = useState('');
  const [showSpinnerStep1, setShowSpinnerStep1] = useState(false);
  const [showSpinnerStep2, setShowSpinnerStep2] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmitSignInStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowSpinnerStep1(true);

    try {
      setErrorMessageSignin('');
      const result = await handleEmailSubmitSign(email);
      if (result?.errors) {
        setErrorMessageSignin(result.errors.email[0]);
      } else {
        setStepSignin(2);
      }
    } catch (error) {
      setErrorMessageSignin((error as Error).message);
    } finally {
      setShowSpinnerStep1(false); // Скрываем спиннер
    }
  };

  const handleSubmitSignInStep2 = () => {
    const otpCodeInput = document.getElementById('otpcode') as HTMLInputElement;
    const passwordInput = document.getElementById(
      'password',
    ) as HTMLInputElement;

    setErrorMessageSignin('');

    // Проверяем, заполнены ли оба поля (OTP и пароль)
    if (!otpCodeInput?.value || !passwordInput?.value) {
      // Если хотя бы одно поле пустое, показываем ошибку и не запускаем спиннер
      setErrorMessageSignin('Some input are empty.');
      return;
    }

    setShowSpinnerStep2(true);
  };

  return (
    <form action={dispatch} className='w-full'>
      <div className='flex flex-col items-center text-foreground'>
        <h1 className='md:text-md mb-3 lg:text-xl xl:text-2xl'>{t('title')}</h1>
        {stepSignin === 1 && (
          <div className='w-full md:w-[250px] lg:w-[300px]'>
            <div className='mt-4'>
              <label
                className='mb-3 mt-5 block text-xs font-medium text-foreground'
                htmlFor='email'
              >
                {t('email')}
              </label>
              <div className='relative'>
                <input
                  className='w-full rounded-md border border-gray-200 bg-primary py-[9px] pl-10 text-sm outline-2 placeholder:text-primary'
                  id='email'
                  type='email'
                  name='email'
                  placeholder={t('email_placeholder')}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <AtSymbolIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-foreground peer-focus:text-foreground' />
              </div>
              <div
                id='email-error'
                aria-live='polite'
                aria-atomic='true'
                className='mt-2'
              >
                {errorMessageFormSignin && (
                  <p className='text-sm text-danger dark:text-red-400'>
                    {errorMessageFormSignin}
                  </p>
                )}
              </div>
              <Button
                type='submit'
                className='mt-4 w-full'
                onClick={handleSubmitSignInStep1}
              >
                {t('continue')}
                <ArrowRightIcon className='ml-auto h-5 w-5 text-gray-50' />
              </Button>
            </div>
            {showSpinnerStep1 && <FullScreenSpinner />}
          </div>
        )}
        {stepSignin === 2 && (
          <>
            <div className='w-full'>
              <div className='mt-4'>
                <label
                  className='mb-3 mt-5 block text-xs font-medium text-foreground'
                  htmlFor='email'
                >
                  Email
                </label>
                <div className='relative mb-4'>
                  <input
                    className='w-full rounded-md border border-gray-200 bg-primary py-[9px] pl-10 text-sm outline-2 placeholder:text-primary'
                    id='email'
                    type='email'
                    name='email'
                    placeholder={t('email_placeholder')}
                    required
                    readOnly
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <AtSymbolIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-foreground' />
                </div>
              </div>
              <div className='mt-4'>
                <label
                  className='mb-3 mt-5 block text-xs font-medium text-foreground'
                  htmlFor='otpcode'
                >
                  OTP Code
                </label>
                <div className='relative'>
                  <input
                    className='w-full rounded-md border border-gray-200 bg-primary py-[9px] pl-10 text-sm outline-2 placeholder:text-primary'
                    id='otpcode'
                    type='text'
                    name='otpcode'
                    placeholder={t('otpcode_placeholder')}
                    required
                  />
                  <ShieldCheckIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400 peer-focus:text-foreground' />
                </div>
              </div>
              <div className='mt-4'>
                <label
                  className='mb-3 mt-5 block text-xs font-medium text-foreground'
                  htmlFor='password'
                >
                  Password
                </label>
                <div className='relative'>
                  <input
                    className='w-full rounded-md border border-gray-200 bg-primary py-[9px] pl-10 text-sm outline-2 placeholder:text-primary'
                    id='password'
                    type={passwordVisible ? 'text' : 'password'}
                    name='password'
                    placeholder={t('password_placeholder')}
                    required
                  />
                  <KeyIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400 peer-focus:text-foreground' />
                  {passwordVisible ? (
                    <EyeIcon
                      onClick={togglePasswordVisibility}
                      className='absolute right-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 cursor-pointer text-gray-400 peer-focus:text-foreground'
                    />
                  ) : (
                    <EyeSlashIcon
                      onClick={togglePasswordVisibility}
                      className='absolute right-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 cursor-pointer text-gray-400 peer-focus:text-foreground'
                    />
                  )}
                </div>
                <div className='mt-2 text-[10px]'>
                  <ul>
                    <li className='mb-2'>{t('password_text')}</li>
                    <li>{t('password_text_2')}</li>
                  </ul>
                </div>
                <div
                  id='input-error'
                  aria-live='polite'
                  aria-atomic='true'
                  className='flex'
                >
                  {errorMessageFormSignin && (
                    <div className='mt-2 flex'>
                      <ExclamationCircleIcon className='mr-2 h-5 w-5 text-danger' />
                      <p className='text-sm text-danger'>
                        {errorMessageFormSignin}
                      </p>
                    </div>
                  )}
                </div>
                <div
                  id='form-error'
                  aria-live='polite'
                  aria-atomic='true'
                  className='flex'
                >
                  {errorMessage && (
                    <div className='mt-2 flex'>
                      <ExclamationCircleIcon className='mr-2 h-5 w-5 text-danger' />
                      <p className='text-sm text-danger'>{errorMessage}</p>
                    </div>
                  )}
                </div>
              </div>
              <Button
                className='mt-4 w-full'
                type='submit'
                onClick={handleSubmitSignInStep2}
              >
                {t('signin')}
                <ArrowRightIcon className='ml-auto h-5 w-5 text-gray-50' />
              </Button>
            </div>
            {!errorMessage && showSpinnerStep2 && <FullScreenSpinner />}
          </>
        )}
      </div>
    </form>
  );
}
