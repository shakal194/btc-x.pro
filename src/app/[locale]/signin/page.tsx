import SignForm from '@/components/PageComponents/CloudMiningPage/signin-form';
import Link from 'next/link';
import Image from 'next/image';
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
      <main className='lg:p-10'>
        <div className='container mx-auto flex grid-flow-col-dense flex-col-reverse items-center gap-8 p-4 md:grid md:grid-cols-2'>
          <div className='mx-auto w-full rounded-xl bg-gradient-to-r from-[#553300] to-[#FE9900] p-[1px] md:w-[300px] lg:w-[400px] xl:w-[500px]'>
            <div className='mx-auto flex flex-col items-center rounded-xl bg-black p-4 lg:p-8'>
              <SignForm />
              <div className='mt-2 flex flex-col'>
                <div className='flex justify-center'>
                  <Link href='/recovery'>
                    <span className='text-md text-center text-black underline transition-all delay-200 duration-300 ease-in-out hover:text-[#FD6B06] focus:text-[#FD6B06] lg:text-xl dark:text-white dark:hover:text-[#FD6B06] dark:focus:text-[#FD6B06]'>
                      {t('forgot')}
                    </span>
                  </Link>
                </div>
                <div className='flex flex-wrap justify-center'>
                  <Link href='/registration' className='ml-[5px]'>
                    <span className='text-md text-center text-black underline transition-all delay-200 duration-300 ease-in-out hover:text-[#FD6B06] focus:text-[#FD6B06] lg:text-xl dark:text-white dark:hover:text-[#FD6B06] dark:focus:text-[#FD6B06]'>
                      {t('signup')}
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div>
            <Image
              src='/cloud_mining_sign.webp'
              width={600}
              height={600}
              alt='Cloud Mining with BTC-X.pro'
              className='rounded-2xl'
            />
          </div>
        </div>
      </main>
    </>
  );
}
