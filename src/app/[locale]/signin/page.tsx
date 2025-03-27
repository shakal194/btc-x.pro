'use client';

//import Link from 'next/link';
import Image from 'next/image';
import { Tabs, Tab, Card, CardBody, Link, CardFooter } from '@heroui/react';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import SignInForm from '@/components/ui/SignInForm';
import SignUpForm from '@/components/ui/SignUpForm';

export default function LoginPage() {
  const t = useTranslations('cloudMiningPage.signin');

  const [selected, setSelected] = useState<string | number>('signin');

  const handleUrlChange = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    const ref = urlParams.get('ref');
    if (tab === 'signup' || ref) {
      setSelected('signup');
    }
  };

  useEffect(() => {
    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  return (
    <>
      <main className='lg:p-10'>
        <div className='container mx-auto flex grid-flow-col-dense flex-col-reverse items-center gap-8 p-4 md:grid md:grid-cols-2'>
          {/*<div className='mx-auto w-full rounded-xl bg-gradient-to-r from-[#553300] to-[#FE9900] p-[1px] md:w-[300px] lg:w-[400px] xl:w-[500px]'>
            <div className='mx-auto flex flex-col items-center rounded-xl bg-black p-4 lg:p-8'>
              <SignForm />
              <div className='mt-2 flex flex-col'>
                <div className='flex justify-center'>
                  <Link href='/recovery'>
                    <span className='text-md text-center text-white underline transition-all delay-200 duration-300 ease-in-out hover:text-[#FD6B06] focus:text-[#FD6B06] lg:text-xl dark:hover:text-[#FD6B06] dark:focus:text-[#FD6B06]'>
                      {t('forgot')}
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>*/}
          <div className='mx-auto w-full rounded-xl bg-gradient-to-r from-[#553300] to-[#FE9900] p-[1px] md:w-[350px] lg:w-[400px] xl:w-[500px]'>
            <div className='mx-auto flex flex-col items-center rounded-xl bg-black p-4 lg:p-8'>
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
                      <SignInForm />
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
                            <Link href='/recovery'>
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
