import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n_work/routing';

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(en|ru|ua)/:path*'],
};
