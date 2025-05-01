'use client';

import { useState, useEffect } from 'react';
import { fetchUserReferralData, fetchUserReferralsCount } from '@/lib/data';
import { Snippet, Button, Card, CardHeader, CardBody } from '@heroui/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

interface ReferralSettingsProps {
  userId: string;
}

export function ReferralSettings({ userId }: ReferralSettingsProps) {
  const { locale } = useParams();
  const [refCode, setRefCode] = useState<number>(0);
  const [refBalance, setRefBalance] = useState<number>(0);
  const [referralLink, setReferralLink] = useState<string>('');
  const [referralPercent, setReferralPercent] = useState<number>(0);
  const [referralsCount, setReferralsCount] = useState<number>(0);

  useEffect(() => {
    const getUserReferralData = async () => {
      try {
        const data = await fetchUserReferralData(Number(userId));
        const count = await fetchUserReferralsCount(Number(userId));
        setRefCode(Number(data.referral_code));
        setRefBalance(Number(data.referral_bonus));
        setReferralPercent(Number(data.referral_percent));
        setReferralsCount(count);
      } catch (error) {
        console.error('Error getting referral data:', error);
        // Set default values in case of error
        setRefCode(0);
        setRefBalance(0);
        setReferralPercent(5);
        setReferralsCount(0);
      }
    };

    if (userId && !isNaN(Number(userId))) {
      getUserReferralData();
    }
  }, [userId]);

  useEffect(() => {
    const origin = window.location.origin;
    setReferralLink(`${origin}/signin?tab=signup&ref=${refCode}`);
  }, [refCode]);

  const handleCopyFullLink = () => {
    navigator.clipboard.writeText(referralLink);
    Notify.success('Ссылка скопирована', {
      timeout: 2000,
    });
  };

  return (
    <div>
      <div className='space-y-4'>
        <div>
          <Snippet
            color='warning'
            className='bg-inherit p-0'
            size='lg'
            codeString={referralLink}
            hideSymbol={true}
            onCopy={handleCopyFullLink}
          >
            Реф.ссылка
          </Snippet>
        </div>

        <div className='grid grid-cols-1 gap-2 md:grid-cols-3'>
          <Card isHoverable={true}>
            <CardHeader>
              <p className='text-center font-bold text-white md:text-[12px] lg:text-[14px]'>
                Реферальный баланс
              </p>
            </CardHeader>
            <CardBody className='text-center'>${refBalance}</CardBody>
          </Card>
          <Card isHoverable={true}>
            <CardHeader>
              <p className='text-center font-bold text-white md:text-[12px] lg:text-[14px]'>
                Реферальный процент
              </p>
            </CardHeader>
            <CardBody className='text-center'>${referralPercent}</CardBody>
          </Card>
          <Card isHoverable={true}>
            <CardHeader>
              <p className='text-center font-bold text-white md:text-[12px] lg:text-[14px]'>
                Количество рефералов
              </p>
            </CardHeader>
            <CardBody className='text-center'>${referralsCount}</CardBody>
          </Card>
        </div>

        <div>
          <Link href={`/${locale}/dashboard/settings/referral-history`}>
            <Button color='secondary' variant='ghost' className='text-white'>
              История реферальных начислений
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
