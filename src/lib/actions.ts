'use server';

import { auth, signIn } from '@/auth';
import { AuthError } from 'next-auth';

const apiMainUrl = process.env.NEXT_PUBLIC_API_MAIN_URL;
const apiMiniUrl = process.env.NEXT_PUBLIC_API_MINI_URL;
const apiRegisterUrl = process.env.NEXT_PUBLIC_API_REGISTR_URL;

export async function handleEmailSubmitSign(email: string) {
  if (!email) {
    console.error('Email can`t be empty.');
    return {
      errors: { email: ['Email can`t be empty.'] },
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
    console.error('Input correct email');
    return {
      errors: { email: ['Input correct email'] },
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
      console.log(emailValidation.status, 'Email not found');
      return {
        errors: { email: ['Email not found.'] },
      };
    }

    const response = await fetch(`${apiRegisterUrl}/Registration/sendcode`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: '*/*' },
      body: JSON.stringify(email),
    });
  } catch (error) {
    console.error('OTP Code don`t send:', error);
    throw new Error('OTP Code don`t send.');
  }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    console.log(error);
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
