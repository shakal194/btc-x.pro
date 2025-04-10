'use client';

import Image from 'next/image';
import { Card, CardBody } from '@heroui/react';
import { useTranslations } from 'next-intl';
import RecoveryForm from '@/components/ui/RecoveryForm';

export default function RecoveryPage() {
  const t = useTranslations('cloudMiningPage.recovery');

  return (
    <>
      <main className='lg:p-10'>
        <div className='container mx-auto flex grid-flow-col-dense flex-col-reverse items-center gap-8 p-4 md:grid md:grid-cols-2'>
          <div className='mx-auto w-full rounded-xl bg-gradient-to-r from-[#553300] to-[#FE9900] p-[1px] md:w-[350px] lg:w-[400px] xl:w-[500px]'>
            <div className='mx-auto flex flex-col items-center rounded-xl bg-black p-4 lg:p-8'>
              <Card className='bg-background'>
                <CardBody className='bg-background'>
                  <RecoveryForm />
                </CardBody>
              </Card>
            </div>
          </div>
          <div>
            <Image
              src='/cloud_mining_sign.webp'
              width={600}
              height={600}
              alt='Cloud Mining with BTC-X.pro'
              className='rounded-2xl'
              priority
            />
          </div>
        </div>
      </main>
    </>
  );
}
