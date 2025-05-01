'use client';

import {
  useState,
  useEffect,
  useMemo,
  useTransition,
  useActionState,
} from 'react';
import { Button, Input, Chip, Form } from '@heroui/react';
import {
  EyeIcon,
  EyeSlashIcon,
  XMarkIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/solid';
import FullScreenSpinner from '@/components/ui/Spinner';
import {
  handlePasswordChangeServer,
  sendChangePasswordOTP,
} from '@/lib/actions';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { signOut } from 'next-auth/react';
import { useLocale } from 'next-intl';

interface ChangePasswordFormProps {
  userId: string;
  userEmail: string;
}

type ActionErrors = {
  currentPassword?: string[];
  otpcode?: string[];
  error?: string[];
  email?: string[];
  newPassword?: string[];
};

type ActionState = {
  errors?: ActionErrors;
  message?: string;
  success?: boolean;
};

export function ChangePasswordForm({
  userId,
  userEmail,
}: ChangePasswordFormProps) {
  const locale = useLocale();

  // States for form visibility and loading
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // States for form inputs
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');

  // States for password visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // States for error messages
  const [errorMessageForm, setErrorMessageForm] = useState('');
  const [errorMessagePassword, setErrorMessagePassword] = useState<string[]>(
    [],
  );

  // Form state
  const initialState: ActionState = {
    message: '',
    success: false,
    errors: {
      currentPassword: undefined,
      otpcode: undefined,
      error: undefined,
      email: undefined,
      newPassword: undefined,
    },
  };

  const [state, formAction] = useActionState(
    handlePasswordChangeServer,
    initialState,
  );
  const [isPending, startTransition] = useTransition();

  // Validation for new password
  useEffect(() => {
    const errors = [];
    if (newPassword.length < 8) {
      errors.push('Пароль должен содержать минимум 8 символов');
    }
    if ((newPassword.match(/[!@#$%^&*(),.?":{}|<>]/) || []).length < 1) {
      errors.push('Пароль должен содержать минимум 1 специальный символ');
    }
    if (newPassword === currentPassword && newPassword !== '') {
      errors.push('Новый пароль не должен совпадать с текущим');
    }
    setErrorMessagePassword(errors);
  }, [newPassword, currentPassword]);

  // Validation states
  const isInvalidCurrentPassword = useMemo(
    () => currentPassword === '',
    [currentPassword],
  );

  const isInvalidNewPassword = useMemo(
    () =>
      newPassword === '' ||
      newPassword.length < 8 ||
      !/[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
    [newPassword],
  );

  const isInvalidConfirmPassword = useMemo(
    () => confirmPassword === '' || confirmPassword !== newPassword,
    [confirmPassword, newPassword],
  );

  const isInvalidOTP = useMemo(
    () => otpCode === '' || !/^\d{5}$/.test(otpCode),
    [otpCode],
  );

  // Effect for handling form state errors and success
  useEffect(() => {
    if (state.errors) {
      setIsLoading(false);
      if (state.errors.currentPassword?.length) {
        Notify.failure(state.errors.currentPassword[0], {
          timeout: 3000,
        });
        setErrorMessageForm(state.errors.currentPassword[0]);
      } else if (state.errors.otpcode?.length) {
        Notify.failure(state.errors.otpcode[0], {
          timeout: 3000,
        });
        setErrorMessageForm(state.errors.otpcode[0]);
      } else if (state.errors.error?.length) {
        Notify.failure(state.errors.error[0], {
          timeout: 3000,
        });
        setErrorMessageForm(state.errors.error[0]);
      }
    } else if (state.success) {
      Notify.success('Пароль успешно изменен', {
        timeout: 3000,
      });

      // Reset form
      setIsFormVisible(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setOtpCode('');
      setErrorMessageForm('');
      setErrorMessagePassword([]);
      setIsLoading(false);

      // Выход из системы с редиректом на страницу входа
      setTimeout(() => {
        signOut({ callbackUrl: `/${locale}/signin?tab=signin` });
      }, 1500);
    }
  }, [state, locale]);

  // Handler for OTP request
  const handleRequestOTP = async () => {
    try {
      setIsLoading(true);
      const result = await sendChangePasswordOTP(userEmail);
      if (result.success) {
        Notify.success('Код подтверждения отправлен на ваш email', {
          timeout: 3000,
        });
      } else {
        Notify.failure(result.error || 'Ошибка при отправке кода', {
          timeout: 3000,
        });
        setErrorMessageForm(result.error || 'Ошибка при отправке кода');
      }
    } catch (error) {
      console.error('Error requesting OTP:', error);
      Notify.failure('Ошибка при отправке кода', {
        timeout: 3000,
      });
      setErrorMessageForm('Ошибка при отправке кода');
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessageForm('');

    if (
      isInvalidCurrentPassword ||
      isInvalidNewPassword ||
      isInvalidConfirmPassword ||
      isInvalidOTP
    ) {
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('email', userEmail);
    formData.append('currentPassword', currentPassword);
    formData.append('newPassword', newPassword);
    formData.append('confirmPassword', confirmPassword);
    formData.append('otpcode', otpCode);

    startTransition(() => {
      formAction(formData);
    });
  };

  // Render password errors
  const renderPasswordErrors = () => (
    <ul>
      {errorMessagePassword.map((error, i) => (
        <li key={i}>{error}</li>
      ))}
    </ul>
  );

  return (
    <div className='space-y-4'>
      <Button
        color='secondary'
        variant='ghost'
        onPress={() => setIsFormVisible(!isFormVisible)}
        className='text-white'
      >
        Изменить пароль
      </Button>

      <div
        className={`transition-all duration-500 ${isFormVisible ? 'translate-y-0 opacity-100' : 'pointer-events-none absolute -translate-y-4 opacity-0'}`}
      >
        <Form onSubmit={handleSubmit} className='w-full max-w-xs space-y-4'>
          <Input
            label='Текущий пароль'
            labelPlacement='inside'
            isInvalid={isInvalidCurrentPassword}
            color={isInvalidCurrentPassword ? 'danger' : 'success'}
            name='currentPassword'
            className='text-white'
            placeholder='Введите текущий пароль'
            isRequired
            type={showCurrentPassword ? 'text' : 'password'}
            value={currentPassword}
            variant='bordered'
            onValueChange={setCurrentPassword}
            endContent={
              <div className='flex items-center gap-2'>
                <div
                  className='cursor-pointer'
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeSlashIcon className='h-[18px] w-[18px]' />
                  ) : (
                    <EyeIcon className='h-[18px] w-[18px]' />
                  )}
                </div>
                {currentPassword.length > 0 && (
                  <div
                    className='cursor-pointer'
                    onClick={() => setCurrentPassword('')}
                  >
                    <XMarkIcon className='h-[18px] w-[18px]' />
                  </div>
                )}
              </div>
            }
          />

          <Input
            label='Новый пароль'
            labelPlacement='inside'
            isInvalid={errorMessagePassword.length > 0}
            color={isInvalidNewPassword ? 'danger' : 'success'}
            name='newPassword'
            className='text-white'
            placeholder='Введите новый пароль'
            isRequired
            type={showNewPassword ? 'text' : 'password'}
            value={newPassword}
            variant='bordered'
            onValueChange={setNewPassword}
            errorMessage={renderPasswordErrors()}
            endContent={
              <div className='flex items-center gap-2'>
                <div
                  className='cursor-pointer'
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeSlashIcon className='h-[18px] w-[18px]' />
                  ) : (
                    <EyeIcon className='h-[18px] w-[18px]' />
                  )}
                </div>
                {newPassword.length > 0 && (
                  <div
                    className='cursor-pointer'
                    onClick={() => setNewPassword('')}
                  >
                    <XMarkIcon className='h-[18px] w-[18px]' />
                  </div>
                )}
              </div>
            }
          />

          <Input
            label='Подтвердить пароль'
            labelPlacement='inside'
            isInvalid={isInvalidConfirmPassword}
            color={isInvalidConfirmPassword ? 'danger' : 'success'}
            name='confirmPassword'
            className='text-white'
            placeholder='Подтвердите новый пароль'
            isRequired
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            variant='bordered'
            onValueChange={setConfirmPassword}
            errorMessage={isInvalidConfirmPassword && 'Пароли не совпадают'}
            endContent={
              <div className='flex items-center gap-2'>
                <div
                  className='cursor-pointer'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className='h-[18px] w-[18px]' />
                  ) : (
                    <EyeIcon className='h-[18px] w-[18px]' />
                  )}
                </div>
                {confirmPassword.length > 0 && (
                  <div
                    className='cursor-pointer'
                    onClick={() => setConfirmPassword('')}
                  >
                    <XMarkIcon className='h-[18px] w-[18px]' />
                  </div>
                )}
              </div>
            }
          />

          <Input
            label='OTP код'
            labelPlacement='inside'
            isInvalid={isInvalidOTP}
            color={isInvalidOTP ? 'danger' : 'success'}
            name='otpCode'
            className='text-white'
            placeholder='Введите OTP код'
            isRequired
            type='text'
            value={otpCode}
            variant='bordered'
            onValueChange={(value) => {
              const digitsOnly = value.replace(/[^\d]/g, '').slice(0, 5);
              setOtpCode(digitsOnly);
            }}
            endContent={
              <Chip
                className='cursor-pointer text-white'
                color='secondary'
                onClick={handleRequestOTP}
                isDisabled={isLoading}
              >
                Получить код
              </Chip>
            }
          />

          {errorMessageForm && (
            <div className='flex items-center gap-2'>
              <ExclamationCircleIcon className='h-5 w-5 text-danger' />
              <p className='text-sm text-danger'>{errorMessageForm}</p>
            </div>
          )}

          <Button
            type='submit'
            color='secondary'
            variant='ghost'
            className='w-full cursor-pointer text-white'
            disabled={
              isInvalidCurrentPassword ||
              isInvalidNewPassword ||
              isInvalidConfirmPassword ||
              isInvalidOTP ||
              isLoading
            }
          >
            Сохранить
          </Button>
        </Form>
      </div>

      {isLoading && <FullScreenSpinner />}
    </div>
  );
}
