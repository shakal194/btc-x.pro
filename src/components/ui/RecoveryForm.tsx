'use client';

import {
  EyeIcon,
  EyeSlashIcon,
  XMarkIcon,
  ArrowRightIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/solid';
import { Button } from '@/components/button';
import { handleEmailSubmitSign, handlePasswordReset } from '@/lib/actions';
import { useState, useMemo } from 'react';
import { Form, Input } from '@heroui/react';
import FullScreenSpinner from '@/components/ui/Spinner';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

export default function RecoveryForm() {
  const t = useTranslations('cloudMiningPage.recovery');
  const [errorMessageForm, setErrorMessageForm] = useState('');
  const [errorMessageEmail, setErrorMessageEmail] = useState('');
  const [step, setStep] = useState(1);
  const [showSpinnerStep1, setShowSpinnerStep1] = useState(false);
  const [showSpinnerStep2, setShowSpinnerStep2] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleConfirm, setIsVisibleConfirm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const validateEmail = (value: string) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);

  const isInvalidEmail = useMemo(() => {
    return email === '' || !validateEmail(email);
  }, [email]);

  const passwordErrors = useMemo(() => {
    const errors: string[] = [];
    if (password.length < 8) {
      errors.push(t('form_error_password'));
    }
    if ((password.match(/[!@#$%^&*(),.?":{}|<>]/) || []).length < 1) {
      errors.push(t('form_error_password_2'));
    }
    return errors;
  }, [password, t]);

  const isInvalidPassword = useMemo(() => {
    return passwordErrors.length > 0;
  }, [passwordErrors]);

  const isInvalidConfirmPassword = useMemo(() => {
    return password !== confirmPassword;
  }, [password, confirmPassword]);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleVisibilityConfirm = () => setIsVisibleConfirm(!isVisibleConfirm);

  const handleClear = () => {
    setPassword('');
  };

  const handleClearConfirm = () => {
    setConfirmPassword('');
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowSpinnerStep1(true);
    setErrorMessageEmail('');

    if (isInvalidEmail) {
      setShowSpinnerStep1(false);
      return;
    }

    try {
      const result = await handleEmailSubmitSign(email);
      if (result?.errors) {
        setErrorMessageEmail(result.errors.email[0]);
      } else {
        setStep(2);
      }
    } catch (error) {
      setErrorMessageEmail((error as Error).message);
    } finally {
      setShowSpinnerStep1(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowSpinnerStep2(true);
    setErrorMessageForm('');

    if (isInvalidPassword || isInvalidConfirmPassword) {
      setShowSpinnerStep2(false);
      return;
    }

    try {
      const result = await handlePasswordReset(email, password);
      if (result.errors) {
        setErrorMessageForm(result.errors.email[0]);
      } else {
        router.push('/signin');
      }
    } catch (error) {
      setErrorMessageForm((error as Error).message);
    } finally {
      setShowSpinnerStep2(false);
    }
  };

  return (
    <Form
      className='mx-auto w-full max-w-xs gap-3 overflow-x-hidden'
      onSubmit={step === 1 ? handleEmailSubmit : handlePasswordSubmit}
    >
      <div className='mx-auto flex w-[250px] flex-col items-center text-foreground lg:w-[300px]'>
        <h1 className='mb-3 text-center text-2xl'>{t('title')}</h1>
        {step === 1 && (
          <div className='mx-auto space-y-4'>
            <Input
              label={t('email')}
              labelPlacement='inside'
              isInvalid={isInvalidEmail}
              color={isInvalidEmail ? 'danger' : 'success'}
              name='email'
              className='text-white'
              placeholder={t('email_placeholder')}
              isRequired
              errorMessage={t('form_error_email')}
              type='email'
              value={email}
              variant='bordered'
              onValueChange={setEmail}
              onClear={() => {}}
            />
            <div id='email-error' aria-live='polite' aria-atomic='true'>
              {errorMessageEmail && (
                <div className='mt-2 flex items-center'>
                  <ExclamationCircleIcon className='mr-2 h-5 w-5 text-danger' />
                  <p className='text-sm text-danger'>{errorMessageEmail}</p>
                </div>
              )}
            </div>
            <Button
              type='submit'
              className={`${isInvalidEmail ? 'bg-danger' : 'bg-success'} mt-4 w-full`}
            >
              {showSpinnerStep1 ? <FullScreenSpinner /> : t('continue')}
              <ArrowRightIcon className='ml-auto h-5 w-5 text-gray-50' />
            </Button>
          </div>
        )}
        {step === 2 && (
          <div className='space-y-4'>
            <Input
              label={t('email')}
              labelPlacement='inside'
              isInvalid={isInvalidEmail}
              color={isInvalidEmail ? 'danger' : 'success'}
              name='email'
              className='text-white'
              placeholder={t('email_placeholder')}
              isRequired
              isDisabled
              type='email'
              value={email}
              variant='bordered'
              onValueChange={setEmail}
              onClear={() => {}}
            />
            <Input
              label={t('new_password')}
              labelPlacement='inside'
              endContent={
                <div className='flex items-center gap-2'>
                  <div className='cursor-pointer' onClick={toggleVisibility}>
                    {isVisible ? (
                      <EyeSlashIcon className='h-[18px] w-[18px]' />
                    ) : (
                      <EyeIcon className='h-[18px] w-[18px]' />
                    )}
                  </div>
                  {password.length > 0 && (
                    <div className='cursor-pointer' onClick={handleClear}>
                      <XMarkIcon className='h-[18px] w-[18px]' />
                    </div>
                  )}
                </div>
              }
              errorMessage={() => (
                <ul>
                  {passwordErrors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              )}
              isInvalid={isInvalidPassword}
              color={isInvalidPassword ? 'danger' : 'success'}
              name='password'
              className='text-white'
              placeholder={t('password_placeholder')}
              isRequired
              type={isVisible ? 'text' : 'password'}
              value={password}
              variant='bordered'
              onValueChange={setPassword}
            />
            <Input
              label={t('confirm_password')}
              labelPlacement='inside'
              endContent={
                <div className='flex items-center gap-2'>
                  <div
                    className='cursor-pointer'
                    onClick={toggleVisibilityConfirm}
                  >
                    {isVisibleConfirm ? (
                      <EyeSlashIcon className='h-[18px] w-[18px]' />
                    ) : (
                      <EyeIcon className='h-[18px] w-[18px]' />
                    )}
                  </div>
                  {confirmPassword.length > 0 && (
                    <div
                      className='cursor-pointer'
                      onClick={handleClearConfirm}
                    >
                      <XMarkIcon className='h-[18px] w-[18px]' />
                    </div>
                  )}
                </div>
              }
              isInvalid={isInvalidConfirmPassword}
              color={isInvalidConfirmPassword ? 'danger' : 'success'}
              name='confirmPassword'
              className='text-white'
              placeholder={t('confirm_password_placeholder')}
              isRequired
              errorMessage={t('form_error_confirm_password')}
              type={isVisibleConfirm ? 'text' : 'password'}
              value={confirmPassword}
              variant='bordered'
              onValueChange={setConfirmPassword}
            />
            <div id='form-error' aria-live='polite' aria-atomic='true'>
              {errorMessageForm && (
                <div className='mt-2 flex items-center'>
                  <ExclamationCircleIcon className='mr-2 h-5 w-5 text-danger' />
                  <p className='text-sm text-danger'>{errorMessageForm}</p>
                </div>
              )}
            </div>
            <Button
              type='submit'
              className={`${isInvalidPassword || isInvalidConfirmPassword ? 'bg-danger' : 'bg-success'} mt-4 w-full`}
            >
              {showSpinnerStep2 ? <FullScreenSpinner /> : t('reset_password')}
            </Button>
          </div>
        )}
      </div>
    </Form>
  );
}
