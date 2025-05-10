import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import db from '@/db/db'; // Импортируем подключение к БД
import { usersTable } from '@/db/schema';
import { sql } from 'drizzle-orm';
import { verifyPassword } from '@/lib/utils';

declare module 'next-auth' {
  interface User {
    apiKey?: string | null;
    status?: string | undefined;
  }
}

const config = {
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
        //otpcode: {},
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
            /*otpcode: z
              .string({ invalid_type_error: 'Please input OTP Code' })
              .length(5, { message: 'OTP code must contains 5 symbols' }) // Проверяем, что длина строки 5
              .regex(/^\d+$/, {
                message: 'OTP code must include only digits', // Проверяем, что строка состоит только из цифр
              }),*/
          })
          .safeParse(credentials);
        if (parsedCredentials.success) {
          const { email, password /*otpcode*/ } = parsedCredentials.data;

          try {
            const user = await db
              .select()
              .from(usersTable)
              .where(sql`${usersTable.email} = ${email}`)
              .limit(1);

            if (user.length === 0) {
              return { error: 'User not found' }; // Если пользователя нет
            }

            const existingUser = user[0];

            const isPasswordValid = await verifyPassword(
              existingUser.password,
              password,
            );

            if (!isPasswordValid) {
              console.log('Invalid password');
              return null; // Неверный пароль
            } else {
              return {
                id: String(existingUser.id),
                email: existingUser.email,
                status: existingUser.status,
              };
            }
            // Если пользователь найден и авторизация успешна
          } catch (error) {
            console.error('Error:', error);
            return null;
          }
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt' as const,
    maxAge: 60 * 60 * 168, // How long until an idle session expires and is no longer valid.
  },
  callbacks: {
    jwt: async ({ token, user }: { token: any; user: any }) => {
      if (user) {
        token.id = user.id;
        token.status = user.status;
        //token.accessToken = user.tokenRespondeModel.access;
        //token.apiKey = user.apiKey;
      }
      return token;
    },
    session: async ({ session, token }: { session: any; token: any }) => {
      session.user.id = token.id;
      session.user.token = token.accessToken;
      session.user.status = token.status;
      //session.user.tokenExpiry = token.exp;
      //session.user.apiKey = token.apiKey;
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
