import SignForm from '@/components/CloudMiningPage/signin-form';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CoinsFish Login Page',
  description: 'Sign in to CoinsFish.',
};

export default function LoginPage() {
  const t = useTranslations('cloudMiningPage.signin');

  return (
    <>
      <main className='flex flex-col p-10'>
        <div className='flex justify-center'>
          <SignForm />
        </div>
        <div className='mt-2 flex flex-col'>
          <div className='flex justify-center'>
            <Link href='/recovery'>
              <span className='dark:hover:text--[#FD6B06] dark:focus:text--[#FD6B06] text-center text-black underline transition-all delay-200 duration-300 ease-in-out hover:text-[#FD6B06] focus:text-[#FD6B06] dark:text-white'>
                {t('forgot')}
              </span>
            </Link>
          </div>
          <div className='flex justify-center'>
            <p className='text-foreground'>{t('notmember')}</p>
            <Link href='/registration' className='ml-[5px]'>
              <span className='dark:hover:text--[#FD6B06] dark:focus:text--[#FD6B06] underline transition-all delay-200 duration-300 ease-in-out hover:text-[#FD6B06] focus:text-[#FD6B06] dark:text-white'>
                {t('signup')}
              </span>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
