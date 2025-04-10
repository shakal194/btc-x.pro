'use client';

import { Tabs, Tab, Card, CardBody, Link, CardFooter } from '@heroui/react';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import SignInForm from '@/components/PageComponents/SignInPage/SignInForm';
import SignUpForm from '@/components/PageComponents/SignInPage/SignUpForm';

interface SignInWrapperProps {
  locale: string;
}

export default function SignInWrapper({ locale }: SignInWrapperProps) {
  const [selected, setSelected] = useState<string | number>('signin');

  const t = useTranslations('cloudMiningPage.signin');

  const handleUrlChange = () => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tab = urlParams.get('tab');
      const ref = urlParams.get('ref');
      if (tab === 'signup' || ref) {
        setSelected('signup');
      }
    }
  };

  useEffect(() => {
    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  return (
    <Tabs
      aria-label='Tabs colors'
      color='secondary'
      radius='lg'
      variant='underlined'
      className='rounded-lg border-1 bg-background'
      selectedKey={selected}
      onSelectionChange={setSelected}
    >
      <Tab key='signin' title={t('signin')}>
        <Card className='bg-background'>
          <CardBody>
            <SignInForm locale={locale} />
            <CardFooter>
              <div className='flex flex-col'>
                <p className='text-md text-center text-white'>
                  {t('create_account')}{' '}
                  <Link
                    onPress={() => setSelected('signup')}
                    className='text-md cursor-pointer text-center text-white underline transition-all delay-200 duration-300 ease-in-out hover:text-[#FD6B06] focus:text-[#FD6B06] lg:text-xl dark:hover:text-[#FD6B06] dark:focus:text-[#FD6B06]'
                  >
                    {t('signup')}
                  </Link>
                </p>{' '}
                <p className='text-md text-center text-white'>
                  <Link href={`/${locale}/recovery`}>
                    <span className='text-md text-center text-white underline transition-all delay-200 duration-300 ease-in-out hover:text-[#FD6B06] focus:text-[#FD6B06] lg:text-xl dark:hover:text-[#FD6B06] dark:focus:text-[#FD6B06]'>
                      {t('forgot')}
                    </span>
                  </Link>
                </p>
              </div>
            </CardFooter>
          </CardBody>
        </Card>
      </Tab>
      <Tab key='signup' title={t('signup')}>
        <Card className='bg-background'>
          <CardBody>
            <SignUpForm />
            <CardFooter>
              <p className='text-md text-center text-white'>
                {t('have_account')}{' '}
                <Link
                  onPress={() => setSelected('signin')}
                  className='text-md cursor-pointer text-center text-white underline transition-all delay-200 duration-300 ease-in-out hover:text-[#FD6B06] focus:text-[#FD6B06] lg:text-xl dark:hover:text-[#FD6B06] dark:focus:text-[#FD6B06]'
                >
                  {t('signin')}
                </Link>
              </p>
            </CardFooter>
          </CardBody>
        </Card>
      </Tab>
    </Tabs>
  );
}
