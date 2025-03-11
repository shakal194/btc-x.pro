'use server';

import { auth, signIn } from '@/auth';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { AuthError } from 'next-auth';
import { getTranslations } from 'next-intl/server';

const apiMainUrl = process.env.NEXT_PUBLIC_API_MAIN_URL;
const apiMiniUrl = process.env.NEXT_PUBLIC_API_MINI_URL;
const apiRegisterUrl = process.env.NEXT_PUBLIC_API_REGISTR_URL;

export async function handleEmailSubmitSign(email: string) {
  const t = await getTranslations('cloudMiningPage.signin');
  if (!email) {
    console.error(t('form_error_email_empty'));
    return {
      errors: { email: [t('form_error_email_empty')] },
    };
    //throw new Error('Email не может быть пустым.');
  }

  const validateEmail = (email: string) => {
    const trimmedEmail = email.trim();
    const regExp = /^[^\s@,]+@[^,\s@]+(\.[^\s@.,]+)+$/;
    return (
      regExp.test(trimmedEmail.toLowerCase()) && !/\.{2,}/.test(trimmedEmail)
    );
  };

  if (!validateEmail(email)) {
    console.error(t('form_error_email'));
    return {
      errors: { email: [t('form_error_email')] },
    };
    //throw new Error('Введите корректный email.');
  }

  try {
    const emailValidation = await fetch(
      `${apiRegisterUrl}/Validation/email-exist`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: '*/*' },
        body: JSON.stringify(email),
      },
    );

    if (emailValidation.status === 400) {
      console.log(emailValidation.status, t('form_error_email_notFound'));
      return {
        errors: { email: [t('form_error_email_notFound')] },
      };
    }

    const response = await fetch(`${apiRegisterUrl}/Registration/sendcode`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: '*/*' },
      body: JSON.stringify(email),
    });
  } catch (error) {
    console.error(t('form_error_otp_notSend'), error);
    throw new Error(t('form_error_otp_notSend'));
  }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  const t = await getTranslations('cloudMiningPage.signin');

  try {
    await signIn('credentials', formData);
  } catch (error) {
    /*if (error instanceof InvalidOtpError) {
      return 'OTP not valid';
    }
    if (error instanceof InvalidLoginError) {
      return 'Login or password incorrect';
    } else {
      return 'Oooops';
    }*/

    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return t('form_validate_login_password');
        default:
          return t('form_validate_errorTimeOut');
      }
    }
    throw error;
  }
}

//BEGIN REGISTR API
//Email Validate
export async function handleEmailSubmitRegister(email: string) {
  const t = await getTranslations('cloudMiningPage.signin');

  if (!email) {
    console.error(t('form_error_email_empty'));
    return {
      errors: { email: [t('form_error_email_empty')] },
    };
    //throw new Error('Email не может быть пустым.');
  }

  const validateEmail = (email: string) => {
    const trimmedEmail = email.trim();
    const regExp = /^[^\s@,]+@[^,\s@]+(\.[^\s@.,]+)+$/;
    return (
      regExp.test(trimmedEmail.toLowerCase()) && !/\.{2,}/.test(trimmedEmail)
    );
  };

  if (!validateEmail(email)) {
    console.error(t('form_error_email'));
    return {
      errors: { email: [t('form_error_email')] },
    };
    //throw new Error('Введите корректный email.');
  }

  try {
    const emailValidation = await fetch(
      `${apiRegisterUrl}/Validation/email-exist`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: '*/*' },
        body: JSON.stringify(email),
      },
    );

    if (emailValidation.status === 200) {
      console.log(emailValidation.status, t('form_error_email_validation'));
      return {
        errors: { email: [t('form_error_email_validation')] },
      };
    }

    const response = await fetch(`${apiRegisterUrl}/Registration/sendcode`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: '*/*' },
      body: JSON.stringify(email),
    });
  } catch (error) {
    console.error(t('form_error_otp_notSend'), error);
    throw new Error(t('form_error_otp_notSend'));
  }
}

//ADD USER

export type AddUserState = {
  errors?: {
    email?: string[];
    login?: string[];
    otpcode?: string[];
    password?: string[];
    confirmPassword?: string[];
    //privacy_and_terms?: string[];
    error?: string[];
  };
  message?: string;
};

export async function addUser(prevState: AddUserState, formData: FormData) {
  const t = await getTranslations('cloudMiningPage.signin');

  const AddUser = z
    .object({
      login: z.string({ invalid_type_error: 'Please input login.' }),
      email: z.string({ invalid_type_error: 'Please input email.' }),
      otpcode: z
        .string({ invalid_type_error: 'Please input a valid OTP Code.' })
        .regex(/^\d{5}$/, { message: 'OTP Code must be exactly 5 digits.' }),
      password: z
        .string({ invalid_type_error: 'Please input password.' })
        .min(8, {
          message: 'Passwords must contains 8 or more symbols.',
        })
        .regex(/[!@#$%^&*(),.?":{}|<>]/, {
          message: 'Passwords must contains special symbols.',
        }),
      confirmPassword: z.string({
        invalid_type_error: 'Please input confirm password.',
      }),
      /*privacy_and_terms: z.string({
      invalid_type_error:
        'Read and accept the Privacy Policy and Terms of Use.',
    }),*/
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ['password'],
      message: 'Passwords do not match.',
    });

  const validatedFields = AddUser.safeParse({
    email: formData.get('email'),
    login: formData.get('email'),
    otpcode: formData.get('otpcode'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
    //privacy_and_terms: formData.get('privacy_and_terms'),
  });

  if (validatedFields.error) {
    // Собираем все ошибки
    const errors = validatedFields.error.flatten().fieldErrors;

    // Дополнительная проверка для логики, не учтенной в `zod`
    if (formData.get('password') !== formData.get('confirmPassword')) {
      errors.password = [
        ...(errors.password || []),
        t('form_password_notMatch'),
      ];
    }

    return {
      errors: errors,
      message: t('form_errorValidation'),
    };
  }

  if (validatedFields.success) {
    const { login, email, otpcode, password } = validatedFields.data;

    try {
      const response = await fetch(`${apiRegisterUrl}/Registration/adduser`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: '*/*' },
        body: JSON.stringify({ email, otpcode, password, login }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error:', errorData);
        if (errorData === 6) {
          return {
            errors: { otpcode: [t('form_validate_otpcode_notValid')] },
          };
        }
        if (errorData === 0) {
          return {
            errors: { email: [t('form_validate_loginExists')] },
          };
        }
        if (errorData === 3) {
          return {
            errors: { password: [t('form_validate_password')] },
          };
        }
        if (errorData === 14) {
          return {
            errors: { email: [t('form_validate_errorDatabase')] },
          };
        }
        //throw new Error(`Request failed with status ${response.status}`);
      }

      console.log(
        'Response status -',
        response.status,
        'Response statusText -',
        response.statusText,
        'User add successfully.',
      );
    } catch (error) {
      return {
        message: t('form_errorTimeOut'),
      };
    }
  }

  revalidatePath('/');
  redirect('/signin');
}
//END REGISTR API
