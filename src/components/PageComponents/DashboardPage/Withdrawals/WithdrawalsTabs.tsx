'use client';

import { Tabs, Tab } from '@heroui/react';
import WithdrawalsPendingTable from './WithdrawalsPendingTable';
import WithdrawalsTable from './WithdrawalsTable';
import { useState, useEffect } from 'react';
import FullScreenSpinner from '@/components/ui/Spinner';
import Notiflix from 'notiflix';
import { confirmWithdrawal, cancelWithdrawal } from '@/lib/data';

interface WithdrawalData {
  id: number;
  user_id: number;
  uuid: string | null;
  userEmail: string;
  coinTicker: string;
  network: string;
  address: string;
  amount: string;
  feeInUSDT: string;
  feeInCoin: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export default function WithdrawalsTabs({
  withdrawals: initialWithdrawals,
  onWithdrawalUpdate,
}: {
  withdrawals: WithdrawalData[];
  onWithdrawalUpdate?: () => void;
}) {
  const [selectedTab, setSelectedTab] = useState('pending');
  const [isLoading, setIsLoading] = useState(true);
  const [withdrawals, setWithdrawals] =
    useState<WithdrawalData[]>(initialWithdrawals);

  useEffect(() => {
    setWithdrawals(initialWithdrawals);
  }, [initialWithdrawals]);

  useEffect(() => {
    // Имитируем загрузку данных
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const updateWithdrawalStatus = (id: number, newStatus: string) => {
    setWithdrawals((prevWithdrawals) =>
      prevWithdrawals.map((withdrawal) =>
        withdrawal.id === id
          ? {
              ...withdrawal,
              status: newStatus,
              updated_at: new Date(),
            }
          : withdrawal,
      ),
    );
  };

  const handleConfirmWithdrawal = async (id: number) => {
    try {
      const result = await confirmWithdrawal(id);

      if (result.success) {
        updateWithdrawalStatus(id, 'confirmed');
        Notiflix.Notify.success('Вывод успешно подтвержден');
        onWithdrawalUpdate?.();
      } else {
        Notiflix.Notify.failure(
          result.error || 'Ошибка при подтверждении вывода',
        );
      }
    } catch (error) {
      console.error('Error confirming withdrawal:', error);
      Notiflix.Notify.failure('Ошибка при подтверждении вывода');
    }
  };

  const handleCancelWithdrawal = async (id: number) => {
    try {
      const result = await cancelWithdrawal(id);

      if (result.success) {
        updateWithdrawalStatus(id, 'canceled');
        Notiflix.Notify.success('Вывод успешно отменен');
        onWithdrawalUpdate?.();
      } else {
        Notiflix.Notify.failure(result.error || 'Ошибка при отмене вывода');
      }
    } catch (error) {
      console.error('Error canceling withdrawal:', error);
      Notiflix.Notify.failure('Ошибка при отмене вывода');
    }
  };

  if (isLoading) {
    return (
      <div className='flex h-[300px] w-full items-center justify-center'>
        <FullScreenSpinner />
      </div>
    );
  }

  return (
    <div className='flex w-full flex-col'>
      <Tabs
        aria-label='Withdrawals tabs'
        color='secondary'
        variant='underlined'
        selectedKey={selectedTab}
        onSelectionChange={(key) => setSelectedTab(key.toString())}
        classNames={{
          tabList: 'gap-6',
          cursor: 'w-full',
          tab: 'max-w-fit px-2 h-12',
        }}
      >
        <Tab key='pending' title='Запросы на вывод'>
          <WithdrawalsPendingTable
            withdrawals={withdrawals}
            onConfirmWithdrawal={handleConfirmWithdrawal}
            onCancelWithdrawal={handleCancelWithdrawal}
            onRefresh={() => onWithdrawalUpdate?.()}
          />
        </Tab>
        <Tab key='all' title='Все запросы'>
          <WithdrawalsTable withdrawals={withdrawals} />
        </Tab>
      </Tabs>
    </div>
  );
}
