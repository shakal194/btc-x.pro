import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { auth } from '@/auth';
import { Locale, i18n } from '@/i18n.config';

const locales = [...i18n.locales];
const defaultLocale = i18n.defaultLocale;
const localePrefix = i18n.localePrefix;

const publicPages = [
  '/',
  '/about-us',
  '/contacts',
  '/cloud-mining',
  '/promo',
  '/airdrop',
  '/referral',
  '/support',
  '/cryptocurrency-wallets',
  '/minimum-deposits-withdrawals',
  '/terms',
  '/privacy',
  '/aml',
  '/signin',
  '/recovery',
];

const authPages = ['/signin'];
const protectedPaths = [
  '/dashboard/algorithms',
  '/dashboard/equipments',
  //'/dashboard/users',
  //'/dashboard/withdrawals',
];

function getProtectedRoutes(protectedPaths: string[], locales: Locale[]) {
  let protectedPathsWithLocale = [...protectedPaths];

  protectedPaths.forEach((route) => {
    locales.forEach(
      (locale) =>
        (protectedPathsWithLocale = [
          ...protectedPathsWithLocale,
          `/${locale}${route}`,
        ]),
    );
  });

  return protectedPathsWithLocale;
}

const testPathnameRegex = (pages: string[], pathName: string): boolean => {
  return RegExp(
    `^(/(${locales.join('|')}))?(${pages.flatMap((p) => (p === '/' ? ['', '/'] : p)).join('|')})/?$`,
    'i',
  ).test(pathName);
};

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix,
});

const protectedPathsWithLocale = getProtectedRoutes(protectedPaths, [
  ...i18n.locales,
]);

const authMiddleware = auth((req) => {
  const isAuthPage = testPathnameRegex(authPages, req.nextUrl.pathname);
  const isProtectedPaths = testPathnameRegex(
    protectedPaths,
    req.nextUrl.pathname,
  );
  const session = req.auth;
  const status = req.auth?.user?.status;

  const pathname = req.nextUrl.pathname;
  const currentLocale = pathname.split('/')[1] || defaultLocale;

  // Redirect to sign-in page if not authenticated
  if (!session && !isAuthPage) {
    const signInUrl = new URL(`/${currentLocale}/signin`, req.nextUrl);
    //signInUrl.searchParams.set('callbackUrl', pathname);

    return NextResponse.redirect(signInUrl);
  }

  if (session && isAuthPage) {
    return NextResponse.redirect(
      new URL(`/${currentLocale}/dashboard`, req.nextUrl),
    );
  }

  if (
    session &&
    status !== 'admin' &&
    protectedPaths.some((route) => pathname.includes(route))
  ) {
    const dashboardUrl = new URL(
      `/${currentLocale}/dashboard`,
      req.nextUrl.origin,
    );

    return NextResponse.redirect(dashboardUrl);
  }

  return intlMiddleware(req);
});

const middleware = (req: NextRequest) => {
  const isPublicPage = testPathnameRegex(publicPages, req.nextUrl.pathname);
  const isAuthPage = testPathnameRegex(authPages, req.nextUrl.pathname);

  if (isAuthPage) {
    return (authMiddleware as any)(req);
  }

  if (isPublicPage) {
    return intlMiddleware(req);
  } else {
    return (authMiddleware as any)(req);
  }
};

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)', '/(en|ru|ua)/:path*'],
};

export default middleware;
