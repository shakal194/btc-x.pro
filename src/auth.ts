import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';

const apiRegisterUrl = process.env.NEXT_PUBLIC_API_REGISTR_URL;

declare module 'next-auth' {
  interface User {
    apiKey?: string | null;
  }
}

const config = {
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
        otpcode: {},
      },
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            email: z
              .string({ invalid_type_error: 'Please input Email' })
              .email(),
            password: z
              .string({ invalid_type_error: 'Please input Email' })
              .min(8),
            otpcode: z
              .string({ invalid_type_error: 'Please input OTP Code' })
              .length(5, { message: 'OTP code must contains 5 symbols' }) // Проверяем, что длина строки 5
              .regex(/^\d+$/, {
                message: 'OTP code must include only digits', // Проверяем, что строка состоит только из цифр
              }),
          })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password, otpcode } = parsedCredentials.data;

          try {
            const res = await fetch(`${apiRegisterUrl}/Registration/signin`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                login: email,
                email: email,
                otpCode: otpcode,
                password: password,
              }),
            });

            const user = await res.json();

            // Если пользователь найден и авторизация успешна
            if (res.ok && user) {
              return user;
            }

            console.log(res);
            // Возвращаем null, если авторизация не удалась
            return null;
          } catch (error) {
            console.error('Error:', error);
            return null;
          }
        }

        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt' as const,
    maxAge: 60 * 60, // How long until an idle session expires and is no longer valid.
  },
  callbacks: {
    jwt: async ({ token, user }: { token: any; user: any }) => {
      if (user) {
        token.id = user.id;
        token.accessToken = user.tokenRespondeModel.access;
        token.apiKey = user.apiKey;
      }
      return token;
    },
    session: async ({ session, token }: { session: any; token: any }) => {
      session.user.id = token.id;
      session.user.token = token.accessToken;
      session.user.tokenExpiry = token.exp;
      session.user.apiKey = token.apiKey;
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
