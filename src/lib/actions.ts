'use server';

import { signIn } from '@/auth';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { AuthError } from 'next-auth';
import { getTranslations } from 'next-intl/server';
import db from '@/db/db';
import { usersTable, otpCodesTable } from '@/db/schema';
import { sql } from 'drizzle-orm';
import { hashPassword, formatDate } from '@/lib/utils';
import {
  fetchUserIdByReferralCode,
  createOTPCode,
  validateOTPCode,
} from '@/lib/data';
import { createDeposit, getToken } from '@/lib/coinsbuy';
import { saveAddress } from '@/lib/balance';
import { getWalletId } from '@/lib/constants';
import { createInitialBalances } from '@/lib/data';
import { sendOTPEmail } from './emailService';

interface CustomAuthError extends Error {
  type?: string;
}

export async function handleEmailSubmitSign(email: string) {
  const t = await getTranslations('cloudMiningPage.signin');

  if (!email) {
    console.error(t('form_error_email_empty'));
    return {
      errors: { email: [t('form_error_email_empty')] },
    };
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
  }

  try {
    const existingUser = await db
      .select()
      .from(usersTable)
      .where(sql`${usersTable.email} = ${email}`)
      .limit(1);

    if (existingUser.length === 0) {
      console.log(
        `[${formatDate(new Date())}] ${t('form_error_email_notFound')}`,
      );
      return {
        errors: { email: [t('form_error_email_notFound')] },
      };
    }

    // Генерируем OTP код
    const otpCode = await createOTPCode(email);

    try {
      // Отправляем код на email
      await sendOTPEmail(email, otpCode);
    } catch (emailError) {
      console.error(
        `[${formatDate(new Date())}] Error sending OTP email:`,
        emailError,
      );
      // Удаляем созданный код, так как не смогли отправить email
      await db
        .delete(otpCodesTable)
        .where(sql`${otpCodesTable.email} = ${email}`);
      throw new Error(t('form_error_email_send'));
    }

    return { success: true };
  } catch (error) {
    console.error(t('form_validate_errorTimeOut'), error);
    throw new Error(t('form_validate_errorTimeOut'));
  }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  const t = await getTranslations('cloudMiningPage.signin');
  const email = formData.get('email') as string;
  const otpCode = formData.get('otpcode') as string;

  try {
    // Проверяем OTP код
    const isValidOTP = await validateOTPCode(email, otpCode);
    if (!isValidOTP) {
      return t('form_validate_otpcode_notValid');
    }

    await signIn('credentials', formData);
  } catch (error) {
    console.log(`[${formatDate(new Date())}] Authentication error:`, error);
    if (error instanceof AuthError) {
      const authError = error as CustomAuthError;
      if (authError.type === 'CredentialsSignin') {
        return t('form_validate_login_password');
      }
      return t('form_validate_errorTimeOut');
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
  }

  try {
    const existingUser = await db
      .select()
      .from(usersTable)
      .where(sql`${usersTable.email} = ${email}`)
      .limit(1);

    if (existingUser.length > 0) {
      return {
        errors: { email: [t('form_error_email_validation')] },
      };
    }

    // Генерируем и сохраняем OTP код
    const otpCode = await createOTPCode(email);

    // Отправляем OTP на email
    await sendOTPEmail(email, otpCode);
  } catch (error) {
    console.error(t('form_error_otp_notSend'), error);
    throw new Error(t('form_error_otp_notSend'));
  }
}

//ADD USER

export type AddUserErrors = {
  email?: string[];
  login?: string[];
  otpcode?: string[];
  referral_code?: string[];
  password?: string[];
  confirmPassword?: string[];
  error?: string[];
};

export type AddUserState = {
  errors: AddUserErrors;
  message?: string;
};

export type AddUserRefCodeErrors = {
  referral_code?: string[];
};

export type AddUserRefCodeState = {
  errors: AddUserRefCodeErrors;
  message?: string;
};

export async function addUser(prevState: AddUserState, formData: FormData) {
  const t = await getTranslations('cloudMiningPage.signin');
  let referrer_id: number | null = null;

  // Проверяем OTP код
  const email = formData.get('email') as string;
  const otpCode = formData.get('otpcode') as string;

  if (!otpCode || !/^\d{5}$/.test(otpCode)) {
    return {
      errors: {
        otpcode: [t('form_error_otpcode')],
      },
      message: t('form_validate_errorValidation'),
    };
  }

  // Проверяем валидность OTP кода
  const isValidOTP = await validateOTPCode(email, otpCode);
  if (!isValidOTP) {
    return {
      errors: {
        otpcode: [t('form_validate_otpcode_notValid')],
      },
      message: t('form_validate_errorValidation'),
    };
  }

  const AddUserRefCode = z.object({
    referral_code: z
      .union([
        z.string().length(0),
        z
          .string({
            invalid_type_error: 'Please input a valid Referral Code.',
          })
          .regex(/^\d{6}$/, {
            message: 'Referral Code must be exactly 6 digits.',
          }),
      ])
      .optional(),
  });

  const validatedReferralCode = AddUserRefCode.safeParse({
    referral_code: formData.get('referral_code'),
  });

  if (validatedReferralCode.error) {
    return {
      errors: {
        referral_code: [t('form_validate_refcode_notValid')],
        error: undefined,
      },
      message: t('form_validate_errorValidation'),
    };
  }

  if (validatedReferralCode.success) {
    if (validatedReferralCode?.data?.referral_code) {
      const result = await fetchUserIdByReferralCode(
        Number(validatedReferralCode.data.referral_code),
      );

      if (!result) {
        return {
          errors: {
            referral_code: [t('form_validate_refcode_notValid')],
            error: undefined,
          },
          message: t('form_validate_errorValidation'),
        };
      }

      referrer_id = result.id;
    }
  }

  const AddUser = z
    .object({
      login: z.string({ invalid_type_error: 'Please input login.' }),
      email: z.string({ invalid_type_error: 'Please input email.' }),
      otpcode: z.string({ invalid_type_error: 'Please input OTP code.' }),
      referral_code: z
        .union([
          z.string().length(0),
          z
            .string({
              invalid_type_error: 'Please input a valid Referral Code.',
            })
            .regex(/^\d{6}$/, {
              message: 'Referral Code must be exactly 6 digits.',
            }),
        ])
        .optional(),
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
  });

  if (validatedFields.error) {
    const errors = validatedFields.error.flatten().fieldErrors;

    if (formData.get('password') !== formData.get('confirmPassword')) {
      errors.password = [
        ...(errors.password || []),
        t('form_password_notMatch'),
      ];
    }

    return {
      errors: errors,
      message: t('form_validate_errorValidation'),
    };
  }

  if (validatedFields.success) {
    const { email, /*referral_code,*/ password } = validatedFields.data;

    try {
      const existingUser = await db
        .select()
        .from(usersTable)
        .where(sql`${usersTable.email} = ${email}`)
        .limit(1);

      if (existingUser.length > 0) {
        console.log(
          `[${formatDate(new Date())}] User already exists with email: ${email}`,
        );
        return {
          errors: {
            email: [t('form_validate_loginExists')],
            login: undefined,
            referral_code: undefined,
            password: undefined,
            confirmPassword: undefined,
            error: undefined,
          },
          message: t('form_validate_errorValidation'),
        };
      }

      const hashedPassword = await hashPassword(password);
      const newUser = await db
        .insert(usersTable)
        .values({
          email,
          password: hashedPassword,
          referrer_id: Number(referrer_id),
          referral_code: Math.floor(100000 + Math.random() * 900000),
          status: 'user',
        })
        .returning();

      // Создаем начальные балансы для USDT и USDC
      await createInitialBalances(newUser[0].id);

      // Create deposit addresses for USDT and USDC
      const token = await getToken();

      // Create deposit address for USDT (TRC20)
      const depositResponseUSDT = await createDeposit(token, {
        label: `Create USDT address ${newUser[0].id}`,
        tracking_id: `Create USDT address ${email}`,
        confirmations_needed: 1,
        payment_page_redirect_url: 'https://btc-x.pro/dashboard',
        payment_page_button_text: 'Вернуться в кабинет',
        relationships: {
          wallet: {
            data: {
              type: 'wallet',
              id: getWalletId('USDT'),
            },
          },
        },
      });

      if (
        !depositResponseUSDT.data?.attributes?.address ||
        !depositResponseUSDT.data?.id
      ) {
        console.error(
          `[${formatDate(new Date())}] Failed to create USDT deposit address:`,
          depositResponseUSDT,
        );
        throw new Error('Failed to create USDT deposit address');
      }

      // Create deposit address for USDC (TRC20)
      const depositResponseUSDC = await createDeposit(token, {
        label: `Create USDC address ${newUser[0].id}`,
        tracking_id: `Create USDC address ${email}`,
        confirmations_needed: 1,
        payment_page_redirect_url: 'https://btc-x.pro/dashboard',
        payment_page_button_text: 'Вернуться в кабинет',
        relationships: {
          wallet: {
            data: {
              type: 'wallet',
              id: getWalletId('USDC'),
            },
          },
        },
      });

      if (
        !depositResponseUSDC.data?.attributes?.address ||
        !depositResponseUSDC.data?.id
      ) {
        console.error(
          `[${formatDate(new Date())}] Failed to create USDC deposit address:`,
          depositResponseUSDC,
        );
        throw new Error('Failed to create USDC deposit address');
      }

      // Create deposit address for USDT (SOL)
      const depositResponseUSDTSOL = await createDeposit(token, {
        label: `Create USDTSOL address ${newUser[0].id}`,
        tracking_id: `Create USDTSOL address ${email}`,
        confirmations_needed: 1,
        payment_page_redirect_url: 'https://btc-x.pro/dashboard',
        payment_page_button_text: 'Вернуться в кабинет',
        relationships: {
          wallet: {
            data: {
              type: 'wallet',
              id: getWalletId('USDT_SOL'),
            },
          },
        },
      });

      if (
        !depositResponseUSDTSOL.data?.attributes?.address ||
        !depositResponseUSDTSOL.data?.id
      ) {
        console.error(
          `[${formatDate(new Date())}] Failed to create USDT-SOL deposit address:`,
          depositResponseUSDTSOL,
        );
        throw new Error('Failed to create USDT-SOL deposit address');
      }

      // Create deposit address for USDC (SOL)
      const depositResponseUSDCSOL = await createDeposit(token, {
        label: `Create USDCSOL address ${newUser[0].id}`,
        tracking_id: `Create USDCSOL address ${email}`,
        confirmations_needed: 1,
        payment_page_redirect_url: 'https://btc-x.pro/dashboard',
        payment_page_button_text: 'Вернуться в кабинет',
        relationships: {
          wallet: {
            data: {
              type: 'wallet',
              id: getWalletId('USDC_SOL'),
            },
          },
        },
      });

      if (
        !depositResponseUSDCSOL.data?.attributes?.address ||
        !depositResponseUSDCSOL.data?.id
      ) {
        console.error(
          `[${formatDate(new Date())}] Failed to create USDC-SOL deposit address:`,
          depositResponseUSDCSOL,
        );
        throw new Error('Failed to create USDC-SOL deposit address');
      }

      // Save addresses for all tokens
      await saveAddress(
        newUser[0].id,
        'USDT',
        depositResponseUSDT.data.attributes.address,
        depositResponseUSDT.data.id,
      );

      await saveAddress(
        newUser[0].id,
        'USDC',
        depositResponseUSDC.data.attributes.address,
        depositResponseUSDC.data.id,
      );

      await saveAddress(
        newUser[0].id,
        'USDT_SOL',
        depositResponseUSDTSOL.data.attributes.address,
        depositResponseUSDTSOL.data.id,
      );

      await saveAddress(
        newUser[0].id,
        'USDC_SOL',
        depositResponseUSDCSOL.data.attributes.address,
        depositResponseUSDCSOL.data.id,
      );

      console.log(
        `[${formatDate(new Date())}] User added successfully with all addresses:`,
        email,
      );
    } catch (error) {
      console.error(`[${formatDate(new Date())}] Error creating user:`, error);
      return {
        errors: {
          email: undefined,
          login: undefined,
          referral_code: undefined,
          password: undefined,
          confirmPassword: undefined,
          error: [t('form_validate_errorTimeOut')],
        },
        message: t('form_validate_errorValidation'),
      };
    }
  }

  revalidatePath('/');
  redirect('/signin');
}

export async function handlePasswordResetServer(
  prevState: any,
  formData: FormData,
) {
  const t = await getTranslations('cloudMiningPage.recovery');
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const otpcode = formData.get('otpcode') as string;

  // Проверка OTP
  const isValidOTP = await validateOTPCode(email, otpcode);
  if (!isValidOTP) {
    return {
      errors: {
        email: undefined,
        otpcode: [t('form_validate_otpcode_notValid')],
        password: undefined,
        confirmPassword: undefined,
      },
      success: false,
    };
  }

  try {
    // Проверяем существование пользователя
    const existingUser = await db
      .select()
      .from(usersTable)
      .where(sql`${usersTable.email} = ${email}`)
      .limit(1);

    if (existingUser.length === 0) {
      return {
        errors: {
          email: [t('form_error_email_notFound')],
          otpcode: undefined,
          password: undefined,
          confirmPassword: undefined,
        },
        success: false,
      };
    }

    // Хешируем новый пароль
    const hashedPassword = await hashPassword(password);

    // Обновляем пароль пользователя
    await db
      .update(usersTable)
      .set({ password: hashedPassword })
      .where(sql`${usersTable.email} = ${email}`);

    return { success: true };
  } catch (error) {
    console.error('Error resetting password:', error);
    return {
      errors: {
        email: [t('form_validate_errorTimeOut')],
        otpcode: undefined,
        password: undefined,
        confirmPassword: undefined,
      },
      success: false,
    };
  }
}
//END REGISTR API
