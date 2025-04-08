'use client';

import { useState, useEffect } from 'react';
import { fetchReferralCodeByUserId, fetchRefBalance } from '@/lib/data';
import { Snippet, Button } from '@heroui/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface ReferralSettingsProps {
  userId: string;
}

export function ReferralSettings({ userId }: ReferralSettingsProps) {
  const { locale } = useParams();
  const [refCode, setRefCode] = useState<number>(0);
  const [refBalance, setRefBalance] = useState<number>(0);
  const [referralLink, setReferralLink] = useState<string>('');

  useEffect(() => {
    const getRefCode = async () => {
      try {
        const data = await fetchReferralCodeByUserId(Number(userId));
        setRefCode(Number(data.referral_code));
      } catch (error) {
        console.error('Error getting referral code:', error);
      }
    };

    if (userId && !isNaN(Number(userId))) {
      getRefCode();
    }
  }, [userId]);

  useEffect(() => {
    const origin = window.location.origin;
    setReferralLink(`${origin}/signin?tab=signup&ref=${refCode}`);
  }, [refCode]);

  useEffect(() => {
    const getRefBalance = async () => {
      try {
        if (!userId || isNaN(Number(userId))) {
          return;
        }

        const data = await fetchRefBalance(Number(userId));
        const numericData =
          typeof data === 'string' ? parseFloat(data) : Number(data);
        setRefBalance(numericData || 0);
      } catch (error) {
        console.error('Error getting referral balance:', error);
        setRefBalance(0);
      }
    };

    if (userId && !isNaN(Number(userId))) {
      getRefBalance();
    }
  }, [userId]);

  const handleCopyFullLink = () => {
    navigator.clipboard.writeText(referralLink);
  };

  return (
    <div>
      {/*<h2 className='mb-2 text-lg font-semibold text-white'>
        Реферальная программа
      </h2>*/}
      <div className='space-y-4'>
        {/*<div>
          <p className='mb-1 text-white'>Ваш реферальный код:</p>
          <Snippet
            color='warning'
            className='bg-inherit'
            size='lg'
            hideSymbol={true}
          >
            {refCode}
          </Snippet>
        </div>*/}

        <div>
          <p className='mb-1 text-white'>Ваша реферальная ссылка:</p>
          <Snippet
            color='warning'
            className='bg-inherit'
            size='lg'
            hideSymbol={true}
            onClick={handleCopyFullLink}
          >
            {referralLink || '/signin?tab=signup&ref=0'}
          </Snippet>
        </div>

        <div>
          <p className='mb-1 text-white'>
            Ваш реферальный баланс: <b>${refBalance}</b>
          </p>
        </div>

        <div>
          <p className='mb-1 text-white'>
            Реферальный процент: <b>5%</b>
          </p>
        </div>

        <div>
          <Link href={`/${locale}/dashboard/settings/referral-history`}>
            <Button color='warning' className='text-white'>
              История начислений
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
