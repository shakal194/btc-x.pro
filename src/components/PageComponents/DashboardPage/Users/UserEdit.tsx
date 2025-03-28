'use client';

import { useState, useEffect, useTransition } from 'react';
import {
  Input,
  Select,
  SelectItem,
  Button,
  Breadcrumbs,
  BreadcrumbItem,
} from '@heroui/react';
import {
  fetchUserDataByUuid,
  updateUserDataByUuid,
  fetchUSDTBalance,
  updateUSDTBalance,
} from '@/lib/data';
import Notiflix from 'notiflix';
import FullScreenSpinner from '@/components/ui/Spinner';

export default function UserEdit({ uuid }: { uuid: string }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'admin' | 'user' | 'delete'>('user');
  const [referralBonus, setReferralBonus] = useState(0);
  const [referralPercent, setReferralPercent] = useState(0);
  const [usdtBalance, setUsdtBalance] = useState(0);
  const [usdtAmount, setUsdtAmount] = useState('');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchUserDataByUuid(uuid);
        if (data) {
          setEmail(data.email);
          setStatus(data.status);
          setReferralBonus(data.referral_bonus ?? 0);
          setReferralPercent(data.referral_percent ?? 0);
          setUserId(data.id);

          // Получаем USDT баланс
          if (data.id) {
            const balance = await fetchUSDTBalance(data.id);
            setUsdtBalance(Number(balance));
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchData();
  }, [uuid]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as 'admin' | 'user' | 'delete';
    setStatus(newStatus);
  };

  const handleReferralBonusChange = (value: string) => {
    const newBonus = Number(value);
    if (!isNaN(newBonus)) {
      setReferralBonus(newBonus);
    }
  };

  const handleReferralPercentChange = (value: string) => {
    const newPercent = Number(value);
    if (!isNaN(newPercent)) {
      setReferralPercent(newPercent);
    }
  };

  const handleUsdtAmountChange = (value: string) => {
    setUsdtAmount(value);
  };

  const handleUpdateUser = () => {
    if (!email || isNaN(referralBonus) || isNaN(referralPercent)) {
      setError(
        'Все поля обязательны для заполнения и должны быть корректными числами',
      );
      Notiflix.Notify.warning('Пожалуйста, заполните все поля корректно');
      return;
    }

    setError('');
    startTransition(async () => {
      try {
        await updateUserDataByUuid(uuid, {
          status,
          referralBonus,
          referralPercent,
        });
        Notiflix.Notify.success('Данные пользователя успешно обновлены');
      } catch (error) {
        console.error('Ошибка при обновлении данных пользователя:', error);
        Notiflix.Notify.failure('Ошибка при обновлении данных пользователя');
      }
    });
  };

  const handleUpdateUsdt = async (isPurchase: boolean) => {
    if (!userId || isNaN(Number(usdtAmount))) {
      Notiflix.Notify.warning('Пожалуйста, введите корректную сумму USDT');
      return;
    }

    try {
      const amount = Number(usdtAmount);
      const newBalance = await updateUSDTBalance(userId, amount, isPurchase);
      setUsdtBalance(newBalance);
      setUsdtAmount('');
      Notiflix.Notify.success(
        `Баланс USDT успешно ${isPurchase ? 'уменьшен' : 'увеличен'}`,
      );
    } catch (error) {
      console.error('Ошибка при обновлении USDT баланса:', error);
      Notiflix.Notify.failure('Ошибка при обновлении USDT баланса');
    }
  };

  return (
    <div className='space-y-4 rounded-lg bg-gray-800 p-6'>
      <Breadcrumbs>
        <BreadcrumbItem href='/dashboard/users' className='text-gray-300'>
          Пользователи
        </BreadcrumbItem>
        <BreadcrumbItem isCurrent className='text-gray-200'>
          Изменить
        </BreadcrumbItem>
      </Breadcrumbs>
      <h1 className='text-xl font-bold text-white'>
        Изменить пользователя: {email}
      </h1>
      {error && <div className='mt-4 text-danger'>{error}</div>}
      <div className='space-y-12'>
        <div className='mt-4'>
          <Select
            value={status}
            onChange={handleStatusChange}
            className='ml-2 w-full md:w-[400px]'
            label='Статус'
            labelPlacement='inside'
            defaultSelectedKeys={[`{status}`]}
            selectedKeys={[status]}
          >
            <SelectItem key='admin'>Admin</SelectItem>
            <SelectItem key='user'>User</SelectItem>
            <SelectItem key='delete'>Deleted</SelectItem>
          </Select>
        </div>
        <div className='mt-4'>
          <label></label>
          <Input
            label='Реф. баланс'
            labelPlacement='inside'
            type='number'
            value={referralBonus.toString()}
            onChange={(e) => handleReferralBonusChange(e.target.value)}
            className='ml-2 w-full md:w-[400px]'
          />
        </div>
        <div className='mt-4'>
          <Input
            label='Реф. процент'
            labelPlacement='inside'
            type='number'
            value={referralPercent.toString()}
            onChange={(e) => handleReferralPercentChange(e.target.value)}
            className='ml-2 w-full md:w-[400px]'
          />
        </div>
        <div className='mt-4'>
          <div className='mb-2 text-white'>
            Текущий баланс USDT: {usdtBalance}
          </div>
          <Input
            label='Сумма USDT'
            labelPlacement='inside'
            type='number'
            value={usdtAmount}
            onChange={(e) => handleUsdtAmountChange(e.target.value)}
            className='ml-2 w-full md:w-[400px]'
          />
          <div className='mt-2 flex gap-2'>
            <Button
              color='success'
              onPress={() => handleUpdateUsdt(false)}
              className='w-1/2'
            >
              Пополнить
            </Button>
            <Button
              color='danger'
              onPress={() => handleUpdateUsdt(true)}
              className='w-1/2'
            >
              Списать
            </Button>
          </div>
        </div>
        <div className='mt-4'>
          <Button
            color='success'
            type='submit'
            className='ml-2 w-full md:w-[250px]'
            onPress={handleUpdateUser}
          >
            Сохранить
          </Button>
        </div>
        <div className='mt-4 flex flex-col space-y-4'>
          <Button className='mr-2 w-full bg-blue-500 p-2 text-white md:w-[400px] md:text-sm'>
            История покупок и продаж оборудования
          </Button>
          <Button className='mr-2 w-full bg-blue-500 p-2 text-white md:w-[400px] md:text-sm'>
            История начисления вознаграждений за майнинг
          </Button>
          <Button className='mr-2 w-full bg-blue-500 p-2 text-white md:w-[400px] md:text-sm'>
            История начисления реферальных бонусов
          </Button>
          <Button className='mr-2 w-full bg-blue-500 p-2 text-white md:w-[400px] md:text-sm'>
            История ввода-вывода средств
          </Button>
          <Button className='w-full bg-blue-500 p-2 text-white md:w-[400px] md:text-sm'>
            История изменений аккаунта
          </Button>
        </div>
      </div>
      {isPending && <FullScreenSpinner />}
    </div>
  );
}
