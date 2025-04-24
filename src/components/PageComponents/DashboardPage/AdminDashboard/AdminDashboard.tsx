'use client';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody } from '@heroui/react';
import {
  getUserCountByStatus,
  getTotalPurchasedShares,
  getTotalBalancesByCoin,
  getTotalReferralBalance,
} from '@/lib/data';
import FullScreenSpinner from '@/components/ui/Spinner';

interface CoinBalance {
  coin_ticker: string;
  total_amount: string;
}

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeUsers, setActiveUsers] = useState(0);
  const [deletedUsers, setDeletedUsers] = useState(0);
  const [totalShares, setTotalShares] = useState(0);
  const [coinBalances, setCoinBalances] = useState<CoinBalance[]>([]);
  const [totalRefBalance, setTotalRefBalance] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          activeUsersCount,
          deletedUsersCount,
          shares,
          balances,
          refBalance,
        ] = await Promise.all([
          getUserCountByStatus('user'),
          getUserCountByStatus('deleted'),
          getTotalPurchasedShares(),
          getTotalBalancesByCoin(),
          getTotalReferralBalance(),
        ]);

        setActiveUsers(activeUsersCount);
        setDeletedUsers(deletedUsersCount);
        setTotalShares(shares);
        setCoinBalances(balances as CoinBalance[]);
        setTotalRefBalance(refBalance);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <FullScreenSpinner />;
  }

  return (
    <div className='space-y-4 p-4'>
      <h1 className='mb-6 text-2xl font-bold text-white'>
        Панель администратора
      </h1>

      <div className='space-y-4'>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          {/* Карточка активных пользователей */}
          <Card className='border-1 border-success bg-default-100'>
            <CardHeader className='text-success-500'>Пользователи</CardHeader>
            <CardBody className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <Card className='border-1 border-success bg-success/20'>
                <CardHeader className='text-success-500'>
                  Активные пользователи
                </CardHeader>
                <CardBody>
                  <span className='text-2xl font-bold text-white'>
                    {activeUsers}
                  </span>
                </CardBody>
              </Card>
              {/* Карточка удаленных пользователей */}
              <Card className='border-1 border-danger bg-danger/20'>
                <CardHeader className='text-danger-500'>
                  Удаленные пользователи
                </CardHeader>
                <CardBody>
                  <span className='text-2xl font-bold text-white'>
                    {deletedUsers}
                  </span>
                </CardBody>
              </Card>
            </CardBody>
          </Card>
          {/* Карточка общего количества долей */}
          <Card className='border-1 border-success bg-default-100'>
            <CardHeader className='text-success-500'>Инфо</CardHeader>
            <CardBody className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <Card className='border-1 border-success bg-success/20'>
                <CardHeader className='text-success-500'>
                  Общее количество долей
                </CardHeader>
                <CardBody>
                  <span className='text-2xl font-bold text-white'>
                    {totalShares}
                  </span>
                </CardBody>
              </Card>
              {/* Карточка общего реферального баланса */}
              <Card className='border-1 border-primary bg-primary/20'>
                <CardHeader className='text-primary-500'>
                  Общий реферальный баланс
                </CardHeader>
                <CardBody>
                  <span className='text-2xl font-bold text-white'>
                    ${Number(totalRefBalance).toFixed(2)}
                  </span>
                </CardBody>
              </Card>
            </CardBody>
          </Card>
        </div>

        {/* Карточка балансов по монетам */}
        <Card className='border-1 border-secondary bg-secondary/20 md:col-span-2'>
          <CardHeader className='text-default-800'>
            Общий баланс по монетам
          </CardHeader>
          <CardBody>
            <div className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
              {coinBalances.map((balance) => (
                <div key={balance.coin_ticker} className='text-center'>
                  <div className='text-gray-400'>{balance.coin_ticker}</div>
                  <div className='text-xl font-bold text-white'>
                    {Number(balance.total_amount).toFixed(
                      ['USDT', 'USDC'].includes(balance.coin_ticker) ? 2 : 8,
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
