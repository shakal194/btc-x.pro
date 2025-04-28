'use client';

import {
  EyeIcon,
  EyeSlashIcon,
  XMarkIcon,
  ArrowRightIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/solid';
import { Button } from '@/components/button';
import { authenticate, handleEmailSubmitSign } from '@/lib/actions';
import {
  useState,
  useMemo,
  useActionState,
  useTransition,
  useEffect,
} from 'react';
import { Form, Input } from '@heroui/react';
import FullScreenSpinner from '@/components/ui/Spinner';
import { useTranslations } from 'next-intl';

interface SignInFormProps {
  locale: string;
}

export default function SignInForm({ locale }: SignInFormProps) {
  const [errorMessageForm, setErrorMessageForm] = useState('');
  const [errorMessageEmail, setErrorMessageEmail] = useState('');
  const [errorMessageOTP, setErrorMessageOTP] = useState('');
  const [errorMessagePassword, setErrorMessagePassword] = useState('');
  const [step, setStep] = useState(1); // 1 - Email, 2 - OTP and Password
  const [showSpinnerStep1, setShowSpinnerStep1] = useState(false);
  const [showSpinnerStep2, setShowSpinnerStep2] = useState(false);

  // Using useActionState hook to handle the form submission
  const [state, formAction] = useActionState(authenticate, undefined);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    // Всегда отключаем спиннер при получении любого ответа
    setShowSpinnerStep2(false);

    if (state) {
      // Если state это строка - это сообщение об ошибке
      if (typeof state === 'string') {
        const errorMessage = state.toLowerCase();
        setErrorMessageForm(state);

        // Устанавливаем соответствующие ошибки в зависимости от типа
        if (errorMessage.includes('otp')) {
          setErrorMessageOTP(state);
        } else if (errorMessage.includes('password')) {
          setErrorMessagePassword(state);
        }
      }
    }
  }, [state]);

  useEffect(() => {
    // Отключаем спиннер когда меняется состояние isPending
    if (!isPending) {
      setShowSpinnerStep2(false);
    }
  }, [isPending]);

  const callbackUrl = `/${locale}/dashboard`;

  const t = useTranslations('cloudMiningPage.signin');
  const [valueEmail, setValueEmail] = useState('');
  const [valueOTPCode, setValueOTPCode] = useState('');
  const [valuePassword, setValuePassword] = useState('');
  const passwordErrors: string[] = [];
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const handleClear = () => {
    setValuePassword('');
  };

  const validateEmail = (value: string) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);

  const isInvalidEmail = useMemo(() => {
    return valueEmail === '' || !validateEmail(valueEmail);
  }, [valueEmail]);

  const isInvalidOTP = useMemo(
    () => valueOTPCode === '' || !/^\d{5}$/.test(valueOTPCode),
    [valueOTPCode],
  );

  if (valuePassword.length < 8) {
    passwordErrors.push(t('form_error_password'));
  }
  if ((valuePassword.match(/[!@#$%^&*(),.?":{}|<>]/) || []).length < 1) {
    passwordErrors.push(t('form_error_password_2'));
  }

  const isInvalidPassword = useMemo(() => {
    return (
      valuePassword === '' ||
      valuePassword.length < 8 ||
      !/[!@#$%^&*(),.?":{}|<>]/.test(valuePassword)
    );
  }, [valuePassword]);

  const isInvalidStep2 = useMemo(() => {
    return (
      valueEmail === '' || valueOTPCode.length !== 5 || valuePassword === ''
    );
  }, [valueEmail, valueOTPCode, valuePassword]);

  const handleEmailChange = (value: string) => {
    setValueEmail(value);
    setErrorMessageEmail(''); // Clear email error when value changes
  };

  const handleOTPChange = (value: string) => {
    setValueOTPCode(value);
    if (!/^\d{5}$/.test(value)) {
      setErrorMessageOTP(t('form_error_otpcode'));
    } else {
      setErrorMessageOTP('');
      setErrorMessageForm('');
    }
    setShowSpinnerStep2(false);
  };

  const handlePasswordChange = (value: string) => {
    setValuePassword(value);
    setErrorMessagePassword(''); // Clear password error when value changes
  };

  const handleSubmitStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowSpinnerStep1(true);
    setErrorMessageEmail('');

    // Валидация
    if (isInvalidEmail) {
      setShowSpinnerStep1(false); // Отключаем спиннер при ошибке
      return;
    }

    try {
      const result = await handleEmailSubmitSign(valueEmail);
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

  // Submit step 2
  const handleSubmitStep2 = (e: any) => {
    e.preventDefault();

    // Валидация
    if (isInvalidPassword || isInvalidOTP || isInvalidEmail) {
      return;
    }

    setShowSpinnerStep2(true);
    setErrorMessageForm('');

    // Создаем FormData
    const formData = new FormData();
    formData.append('email', valueEmail);
    formData.append('otpcode', valueOTPCode);
    formData.append('password', valuePassword);
    formData.append('redirectTo', callbackUrl || '/dashboard');

    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <>
      <Form
        className='mx-auto w-full max-w-xs gap-3 overflow-x-hidden'
        action={formAction}
      >
        <div className='mx-auto flex w-[250px] flex-col items-center text-foreground lg:w-[300px]'>
          <h1 className='mb-3 text-center text-2xl'>{t('title_signin')}</h1>
          {step === 1 && (
            <div className='mx-auto space-y-4'>
              <Input
                label={t('email')}
                labelPlacement='inside'
                isInvalid={isInvalidEmail || !!errorMessageEmail}
                color={
                  isInvalidEmail || !!errorMessageEmail ? 'danger' : 'success'
                }
                name='email'
                className='text-white'
                placeholder={t('email_placeholder')}
                isRequired
                errorMessage={errorMessageEmail || t('form_error_email')}
                type='email'
                value={valueEmail}
                variant='bordered'
                onValueChange={handleEmailChange}
                onClear={() => {}}
              />
              <Button
                type='submit'
                className={`${isInvalidEmail || !!errorMessageEmail ? 'bg-danger' : 'bg-success'} mt-4 w-full`}
                onClick={handleSubmitStep1}
              >
                {t('button')}
                <ArrowRightIcon className='ml-auto h-5 w-5 text-gray-50' />
              </Button>
              {showSpinnerStep1 && <FullScreenSpinner />}
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
                id='email'
                className='text-white'
                placeholder={t('email_placeholder')}
                isRequired
                isDisabled
                errorMessage={t('form_error_email')}
                type='email'
                value={valueEmail}
                variant='bordered'
              />
              <Input
                label={t('otpcode')}
                labelPlacement='inside'
                isInvalid={!!isInvalidOTP}
                color={isInvalidOTP ? 'danger' : 'success'}
                name='otpcode'
                className='text-white'
                placeholder={t('otpcode_placeholder')}
                isRequired
                errorMessage={
                  isInvalidOTP ? t('form_error_otpcode') : undefined
                }
                type='text'
                value={valueOTPCode}
                variant='bordered'
                onValueChange={(value) => {
                  const digitsOnly = value.replace(/[^\d]/g, '').slice(0, 5);
                  handleOTPChange(digitsOnly);
                }}
                onClear={() => handleOTPChange('')}
              />
              <div>
                <Input
                  label={t('password')}
                  labelPlacement='inside'
                  endContent={
                    <div className='flex items-center gap-2'>
                      <div
                        className='cursor-pointer'
                        onClick={toggleVisibility}
                      >
                        {isVisible ? (
                          <EyeSlashIcon className='h-[18px] w-[18px]' />
                        ) : (
                          <EyeIcon className='h-[18px] w-[18px]' />
                        )}
                      </div>
                      {valuePassword.length > 0 && (
                        <div className='cursor-pointer' onClick={handleClear}>
                          <XMarkIcon className='h-[18px] w-[18px]' />
                        </div>
                      )}
                    </div>
                  }
                  errorMessage={
                    passwordErrors.length > 0
                      ? () => (
                          <ul>
                            {passwordErrors.map((error, i) => (
                              <li key={i}>{error}</li>
                            ))}
                          </ul>
                        )
                      : undefined
                  }
                  isInvalid={passwordErrors.length > 0}
                  color={isInvalidPassword ? 'danger' : 'success'}
                  name='password'
                  id='password'
                  className='text-white'
                  placeholder={t('password_placeholder')}
                  isRequired
                  type={isVisible ? 'text' : 'password'}
                  value={valuePassword}
                  variant='bordered'
                  onValueChange={handlePasswordChange}
                />
              </div>
              <div
                id='form-error'
                aria-live='polite'
                aria-atomic='true'
                className='flex'
              >
                {state && (
                  <div className='mt-2 flex'>
                    <ExclamationCircleIcon className='mr-2 h-5 w-5 text-danger' />
                    <p className='text-sm text-danger'>{state}</p>
                  </div>
                )}
              </div>
              {<input type='hidden' name='redirectTo' value={callbackUrl} />}
              <Button
                type='submit'
                className={`${isInvalidStep2 ? 'bg-danger' : 'bg-success'} mt-4 w-full`}
                onClick={handleSubmitStep2}
              >
                {showSpinnerStep2 ? <FullScreenSpinner /> : `${t('button')}`}
              </Button>
            </div>
          )}
        </div>
      </Form>
    </>
  );
}
