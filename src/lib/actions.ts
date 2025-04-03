'use server';

import { signIn } from '@/auth';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { AuthError } from 'next-auth';
import { getTranslations } from 'next-intl/server';
import db from '@/db/db';
import { usersTable } from '@/db/schema';
import { sql } from 'drizzle-orm';
import { hashPassword } from '@/lib/utils';
import { fetchUserIdByReferralCode } from '@/lib/data';
import { createDeposit, getToken } from '@/lib/coinsbuy';
import { saveAddress } from '@/lib/balance';
import { getWalletId } from '@/lib/constants';
import { createInitialBalances } from '@/lib/data';

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
    const existingUser = await db
      .select()
      .from(usersTable)
      .where(sql`${usersTable.email} = ${email}`)
      .limit(1);

    if (existingUser.length === 0) {
      console.log(t('form_error_email_notFound'));
      return {
        errors: { email: [t('form_error_email_notFound')] },
      };
    }
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
    console.log('actions', error);
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
    const existingUser = await db
      .select()
      .from(usersTable)
      .where(sql`${usersTable.email} = ${email}`)
      .limit(1);

    if (existingUser.length > 0) {
      console.log(t('form_error_email_validation'));
      return {
        errors: { email: [t('form_error_email_validation')] },
      };
    }

    console.log('Email is valid and unique. Proceeding with OTP sending.');
  } catch (error) {
    console.error(t('form_error_otp_notSend'), error);
    throw new Error(t('form_error_otp_notSend'));
  }
}

//ADD USER

export type AddUserErrors = {
  email?: string[];
  login?: string[];
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

  const AddUser = z
    .object({
      login: z.string({ invalid_type_error: 'Please input login.' }),
      email: z.string({ invalid_type_error: 'Please input email.' }),
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

  const validatedFields = AddUser.safeParse({
    email: formData.get('email'),
    login: formData.get('email'),
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

      // Create deposit address for USDT
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

      console.log('USDT Deposit response:', depositResponseUSDT);

      if (
        !depositResponseUSDT.data?.attributes?.address ||
        !depositResponseUSDT.data?.id
      ) {
        console.error(
          'Failed to create USDT deposit address:',
          depositResponseUSDT,
        );
        throw new Error('Failed to create USDT deposit address');
      }

      // Create deposit address for USDC
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

      console.log('USDC Deposit response:', depositResponseUSDC);

      if (
        !depositResponseUSDC.data?.attributes?.address ||
        !depositResponseUSDC.data?.id
      ) {
        console.error(
          'Failed to create USDC deposit address:',
          depositResponseUSDC,
        );
        throw new Error('Failed to create USDC deposit address');
      }

      // Save addresses for both USDT and USDC
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

      console.log(
        'User added successfully with USDT and USDC addresses:',
        email,
      );
    } catch (error) {
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

export async function handlePasswordReset(email: string, password: string) {
  const t = await getTranslations('cloudMiningPage.recovery');

  try {
    // Проверяем существование пользователя
    const existingUser = await db
      .select()
      .from(usersTable)
      .where(sql`${usersTable.email} = ${email}`)
      .limit(1);

    if (existingUser.length === 0) {
      return {
        errors: { email: [t('form_error_email_notFound')] },
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
    throw new Error(t('form_validate_errorTimeOut'));
  }
}
//END REGISTR API
