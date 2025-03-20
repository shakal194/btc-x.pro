'use server';

import { signIn } from '@/auth';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { AuthError } from 'next-auth';
import { getTranslations } from 'next-intl/server';
import db from '@/db/db'; // Импортируем подключение к БД
import { usersTable } from '@/db/schema';
import { sql } from 'drizzle-orm';
import { hashPassword } from '@/lib/utils';
import { fetchUserIdByReferralCode } from '@/lib/data';

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
      await db.insert(usersTable).values({
        email,
        password: hashedPassword,
        referrer_id: Number(referrer_id),
        referral_code: Math.floor(100000 + Math.random() * 900000),
        status: 'user',
      });

      console.log('User added successfully', email);
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
//END REGISTR API
