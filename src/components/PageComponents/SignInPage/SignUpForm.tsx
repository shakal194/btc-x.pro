'use client';

import {
  EyeIcon,
  EyeSlashIcon,
  XMarkIcon,
  ArrowRightIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/solid';
import { Button } from '@/components/button';
import { addUser, handleEmailSubmitRegister } from '@/lib/actions';
import {
  useState,
  useEffect,
  useMemo,
  useTransition,
  useActionState,
} from 'react';
import { Checkbox, Form, Input, Link } from '@heroui/react';
import FullScreenSpinner from '@/components/ui/Spinner';
import { useTranslations } from 'next-intl';

export default function SignUpForm() {
  const t = useTranslations('cloudMiningPage.signin');

  // All state hooks
  const [errorMessageForm, setErrorMessageForm] = useState('');
  const [errorMessageEmail, setErrorMessageEmail] = useState('');
  const [errorMessageOTP, setErrorMessageOTP] = useState('');
  const [errorMessagePassword, setErrorMessagePassword] = useState<string[]>(
    [],
  );
  const [step, setStep] = useState(1); // 1 - Email, 2 - OTP and Password
  const [showSpinnerStep, setShowSpinnerStep] = useState(false);
  const [valueEmail, setValueEmail] = useState('');
  const [valueOTPCode, setValueOTPCode] = useState('');
  const [valueReferralCode, setValueReferralCode] = useState('');
  const [valuePassword, setValuePassword] = useState('');
  const [valueConfirmPassword, setValueConfirmPassword] = useState('');
  const [valuePrivacy, setValuePrivacy] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Handle referral code from URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const refCode = urlParams.get('ref');
      if (refCode && /^\d{6}$/.test(refCode)) {
        setValueReferralCode(refCode);
      }
    }
  }, []);

  // Form state and transitions
  const initialState = {
    message: '',
    errors: {
      email: undefined,
      login: undefined,
      otpcode: undefined,
      referral_code: undefined,
      password: undefined,
      confirmPassword: undefined,
      error: undefined,
    },
  };
  const [state, formAction] = useActionState(addUser, initialState);
  const [isPending, startTransition] = useTransition();

  // Memoized values
  useEffect(() => {
    const errors = [];
    if (valuePassword.length < 8) {
      errors.push(t('form_error_password'));
    }
    if ((valuePassword.match(/[!@#$%^&*(),.?":{}|<>]/) || []).length < 1) {
      errors.push(t('form_error_password_2'));
    }
    setErrorMessagePassword(errors);
  }, [valuePassword, t]);

  useEffect(() => {
    if (state.errors) {
      setShowSpinnerStep(false);

      // Проверяем наличие ошибок через switch
      const getFirstError = () => {
        if ('otpcode' in state.errors && state.errors.otpcode?.length) {
          return { type: 'otpcode', message: state.errors.otpcode[0] };
        }
        if ('email' in state.errors && state.errors.email?.length) {
          return { type: 'email', message: state.errors.email[0] };
        }
        if ('password' in state.errors && state.errors.password?.length) {
          return { type: 'password', message: state.errors.password[0] };
        }
        if ('error' in state.errors && state.errors.error?.length) {
          return { type: 'error', message: state.errors.error[0] };
        }
        return { type: 'default', message: t('form_validate_errorValidation') };
      };

      const { type, message } = getFirstError();

      switch (type) {
        case 'otpcode':
        case 'email':
        case 'error':
          setErrorMessageForm(message);
          break;
        case 'password':
          setErrorMessagePassword([message]);
          break;
        default:
          setErrorMessageForm(message);
      }
    }
  }, [state, t]);

  // Render the error messages
  const renderPasswordErrors = () => (
    <ul>
      {errorMessagePassword.map((error, i) => (
        <li key={i}>{error}</li>
      ))}
    </ul>
  );

  const validateEmail = (value: string) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);

  const isInvalidEmail = useMemo(() => {
    return valueEmail === '' || !validateEmail(valueEmail);
  }, [valueEmail]);

  const isInvalidOTP = useMemo(
    () => valueOTPCode === '' || !/^\d{5}$/.test(valueOTPCode),
    [valueOTPCode],
  );

  const isInvalidReferralCode = useMemo(() => {
    return valueReferralCode !== '' && !/^\d{6}$/.test(valueReferralCode);
  }, [valueReferralCode]);

  const isInvalidPassword = useMemo(() => {
    return (
      valuePassword === '' ||
      valuePassword.length < 8 ||
      !/[!@#$%^&*(),.?":{}|<>]/.test(valuePassword)
    );
  }, [valuePassword]);

  const isInvalidStep2 = useMemo(() => {
    return (
      valueEmail === '' ||
      valueOTPCode.length !== 5 ||
      (valueReferralCode !== '' && valueReferralCode.length !== 6) ||
      valuePassword === '' ||
      valueConfirmPassword === '' ||
      !valuePrivacy
    );
  }, [
    valueEmail,
    valueOTPCode,
    valuePassword,
    valueReferralCode,
    valueConfirmPassword,
    valuePrivacy,
  ]);

  // Handlers
  const toggleVisibility = () => setIsVisible(!isVisible);
  const handleClear = () => {
    setValuePassword('');
  };

  const handleEmailChange = (value: string) => {
    setValueEmail(value);
    setErrorMessageEmail('');
  };

  const handleOTPChange = (value: string) => {
    setValueOTPCode(value);
    setErrorMessageOTP('');
    setErrorMessageForm('');
  };

  const handleReferralCodeChange = (value: string) => {
    setValueReferralCode(value);
    setErrorMessageForm('');

    // Очищаем ошибку только если значение пустое или содержит 6 цифр
    if (value === '' || /^\d{6}$/.test(value)) {
      const formData = new FormData();
      formData.append('referral_code', value);
      startTransition(() => {
        formAction(formData);
      });
    }
  };

  const handlePasswordChange = (value: string) => {
    setValuePassword(value);
    setErrorMessagePassword([]);
    setErrorMessageForm('');
  };

  const handleConfirmPasswordChange = (value: string) => {
    setValueConfirmPassword(value);
    setErrorMessageForm('');
  };

  const handleSubmitStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowSpinnerStep(true);
    setErrorMessageEmail('');

    // Валидация
    if (isInvalidEmail) {
      setShowSpinnerStep(false); // Отключаем спиннер при ошибке
      return;
    }

    try {
      const result = await handleEmailSubmitRegister(valueEmail);
      if (result?.errors) {
        setErrorMessageEmail(t('form_error_email_validation'));
      } else {
        setStep(2);
      }
    } catch (error) {
      setErrorMessageEmail((error as Error).message);
    } finally {
      setShowSpinnerStep(false);
    }
  };

  // Submit step 2
  const handleSubmitStep2 = async (e: any) => {
    e.preventDefault();
    setShowSpinnerStep(true);
    setErrorMessageForm('');

    // Валидация
    if (
      isInvalidPassword ||
      isInvalidOTP ||
      valuePassword !== valueConfirmPassword ||
      !valuePrivacy ||
      (valueReferralCode && !/^\d{6}$/.test(valueReferralCode))
    ) {
      setShowSpinnerStep(false);
      return;
    }

    // Создаем FormData
    const formData = new FormData();
    formData.append('email', valueEmail);
    formData.append('otpcode', valueOTPCode);
    formData.append('referral_code', valueReferralCode || '415384');
    formData.append('password', valuePassword);
    formData.append('confirmPassword', valueConfirmPassword);

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
        <div className='flex w-[250px] flex-col items-center text-foreground lg:w-[300px]'>
          <h1 className='mb-3 text-2xl'>{t('title_signup')}</h1>
          {step === 1 && (
            <div className='space-y-4'>
              <Input
                label='Email'
                labelPlacement='inside'
                isInvalid={!!errorMessageEmail || isInvalidEmail}
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
                className={`${isInvalidEmail ? 'bg-danger' : 'bg-success'} mt-4 w-full`}
                onClick={handleSubmitStep1}
              >
                {t('button')}
                <ArrowRightIcon className='ml-auto h-5 w-5 text-gray-50' />
              </Button>
              {showSpinnerStep && <FullScreenSpinner />}
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
                errorMessage={state.errors?.email?.[0] || t('form_error_email')}
                type='email'
                value={valueEmail}
                variant='bordered'
                onValueChange={handleEmailChange}
                onClear={() => {}}
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
                  isInvalidOTP
                    ? t('form_error_otpcode')
                    : errorMessageForm &&
                        errorMessageForm.toLowerCase().includes('otp')
                      ? errorMessageForm
                      : undefined
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
              <Input
                label={t('referralcode')}
                labelPlacement='inside'
                name='referral_code'
                isInvalid={
                  isInvalidReferralCode || !!state.errors?.referral_code?.[0]
                }
                color={
                  isInvalidReferralCode || !!state.errors?.referral_code?.[0]
                    ? 'danger'
                    : 'success'
                }
                className='text-white'
                placeholder={t('referralcode_placeholder')}
                errorMessage={
                  state.errors?.referral_code?.[0] || t('form_error_refcode')
                }
                type='text'
                value={valueReferralCode}
                variant='bordered'
                onValueChange={handleReferralCodeChange}
                onClear={() => {}}
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
                  errorMessage={renderPasswordErrors}
                  isInvalid={errorMessagePassword.length > 0}
                  color={isInvalidPassword ? 'danger' : 'success'}
                  name='password'
                  className='text-white'
                  placeholder={t('password_placeholder')}
                  isRequired
                  type={isVisible ? 'text' : 'password'}
                  value={valuePassword}
                  variant='bordered'
                  onValueChange={handlePasswordChange}
                />
              </div>
              <div>
                <Input
                  label={t('confirm_password')}
                  labelPlacement='inside'
                  isInvalid={valuePassword !== valueConfirmPassword}
                  color={
                    valuePassword !== valueConfirmPassword
                      ? 'danger'
                      : 'success'
                  }
                  name='confirmPassword'
                  className='text-white'
                  placeholder={t('confirm_password_placeholder')}
                  isRequired
                  errorMessage={t('form_error_confirm_password')}
                  type='password'
                  value={valueConfirmPassword}
                  variant='bordered'
                  onValueChange={handleConfirmPasswordChange}
                  onClear={() => {}}
                />
              </div>
              <Checkbox
                color='success'
                isRequired={true}
                name='privacy_and_terms'
                id='privacy_and_terms'
                onChange={(e) => setValuePrivacy(e.target.checked)}
              />
              <label htmlFor='privacy_and_terms' className='ml-2'>
                <span>I agree with </span>
                <Link
                  href='/terms'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-white underline hover:cursor-pointer hover:text-secondary hover:transition-all focus:hover:cursor-pointer'
                >
                  Terms of Use
                </Link>
                <span> and </span>
                <span>
                  <Link
                    href='/privacy'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-white underline hover:cursor-pointer hover:text-secondary hover:transition-all focus:hover:cursor-pointer'
                  >
                    Privacy Policy
                  </Link>
                </span>
              </label>
              <div id='form-error' aria-live='polite' aria-atomic='true'>
                {errorMessageForm && (
                  <div className='flex items-center gap-2'>
                    <ExclamationCircleIcon className='h-5 w-5 text-danger' />
                    <p className='text-sm text-danger'>{errorMessageForm}</p>
                  </div>
                )}
              </div>
              <Button
                type='submit'
                className={`${isInvalidStep2 ? 'bg-danger' : 'bg-success'} mt-4 w-full`}
                onClick={handleSubmitStep2}
              >
                {showSpinnerStep ? <FullScreenSpinner /> : `${t('button')}`}
              </Button>
            </div>
          )}
        </div>
      </Form>
    </>
  );
}
