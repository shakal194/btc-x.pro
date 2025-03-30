'use client';

import { useEffect, useState } from 'react';
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
import { useRouter } from 'next/navigation';

export default function UserEdit({ uuid }: { uuid: string }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'admin' | 'user' | 'delete'>('user');
  const [referralBonus, setReferralBonus] = useState(0);
  const [referralPercent, setReferralPercent] = useState(0);
  const [usdtBalance, setUsdtBalance] = useState<number>(0);
  const [usdtAmount, setUsdtAmount] = useState<string>('0');
  const [userId, setUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
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
            setUsdtAmount(balance.toString());
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Notiflix.Notify.failure('Ошибка при загрузке данных пользователя');
      } finally {
        setIsLoading(false);
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
    // Разрешаем только числа с точкой
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      setUsdtAmount(value);
    }
  };

  const handleUpdateUser = async () => {
    if (!email || isNaN(referralBonus) || isNaN(referralPercent)) {
      Notiflix.Notify.warning('Пожалуйста, заполните все поля корректно');
      return;
    }

    try {
      setIsLoading(true);

      // Обновляем USDT баланс если он изменился
      const newBalance = parseFloat(usdtAmount);
      if (!isNaN(newBalance) && newBalance !== usdtBalance && userId) {
        // Вычисляем разницу между текущим и новым балансом
        const difference = newBalance - usdtBalance;
        // Если разница отрицательная - списываем, если положительная - пополняем
        const isDecrease = difference < 0;
        await updateUSDTBalance(userId, Math.abs(difference), isDecrease);
        setUsdtBalance(newBalance);
      }

      await updateUserDataByUuid(uuid, {
        status,
        referralBonus,
        referralPercent,
      });

      Notiflix.Notify.success('Данные пользователя успешно обновлены');
    } catch (error) {
      console.error('Error updating user:', error);
      Notiflix.Notify.failure('Ошибка при обновлении данных пользователя');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen w-full space-y-4 bg-black/90 p-4'>
      <div className='rounded-lg bg-gray-800 p-4'>
        {isLoading ? (
          <div className='flex h-[200px] items-center justify-center'>
            <FullScreenSpinner />
          </div>
        ) : (
          <>
            <Breadcrumbs>
              <BreadcrumbItem href='/dashboard/users' className='text-gray-300'>
                Пользователи
              </BreadcrumbItem>
              <BreadcrumbItem isCurrent className='text-gray-200'>
                {email}
              </BreadcrumbItem>
            </Breadcrumbs>
            <h1 className='text-xl font-bold text-white'>
              Изменить пользователя: {email}
            </h1>
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
                  label='Баланс USDT'
                  labelPlacement='inside'
                  type='number'
                  value={usdtAmount}
                  onChange={(e) => handleUsdtAmountChange(e.target.value)}
                  className='w-full md:w-[400px]'
                  description='Введите новое значение баланса'
                />
              </div>
              <div className='mt-4'>
                <Button
                  color='success'
                  size='lg'
                  onPress={handleUpdateUser}
                  className='mt-4'
                  isDisabled={isLoading}
                >
                  {isLoading ? <FullScreenSpinner /> : 'Сохранить изменения'}
                </Button>
              </div>
              <div className='mt-4 flex flex-col space-y-4'>
                <Button
                  className='mr-2 w-full bg-blue-500 p-2 text-white md:w-[400px] md:text-sm'
                  onClick={() =>
                    router.push(
                      `/dashboard/users/${uuid}/equipment-transactions`,
                    )
                  }
                >
                  История покупок и продаж оборудования
                </Button>
                <Button className='mr-2 w-full bg-blue-500 p-2 text-white md:w-[400px] md:text-sm'>
                  История начисления вознаграждений за майнинг
                </Button>
                <Button
                  className='mr-2 w-full bg-blue-500 p-2 text-white md:w-[400px] md:text-sm'
                  onClick={() =>
                    router.push(`/dashboard/users/${uuid}/referral-bonus`)
                  }
                >
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
          </>
        )}
      </div>
    </div>
  );
}
