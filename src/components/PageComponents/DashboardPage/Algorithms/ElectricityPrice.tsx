'use client';

import { useState, useEffect, useTransition } from 'react';
import { Input, Button } from '@heroui/react';
import FullScreenSpinner from '@/components/ui/Spinner';
import { CloudArrowDownIcon } from '@heroicons/react/24/outline';
import {
  fetchElectricityPrice,
  insertElectricityPrice,
  insertRefBonusDefault,
  fetchRefBonusDefault,
} from '@/lib/data'; // Импортируем функцию из data.ts
import Notiflix from 'notiflix';

export default function ElectricityPrice() {
  const [isPending, startTransition] = useTransition();

  const [lastPrice, setLastPrice] = useState<any>(null);
  const [lastPriceDate, setLastPriceDate] = useState<any>(null);
  const [price, setPrice] = useState(''); // Состояние для хранения введённой цены
  const [errorPrice, setErrorPrice] = useState<string | null>(null); // Для ошибки валидации

  const [lastRefBonus, setLastRefBonus] = useState<any>(null);
  const [lastRefBonusDate, setLastRefBonusDate] = useState<any>(null);
  const [refBonus, setRefBonus] = useState(''); // Состояние для хранения введённой цены
  const [errorRefBonus, setErrorRefBonus] = useState<string | null>(null); // Для ошибки валидации

  useEffect(() => {
    const getLastPrice = async () => {
      try {
        const data = await fetchElectricityPrice(); // Получаем данные с сервера
        console.log('fetchElectricityPrice', data);
        setLastPrice(data.pricePerKWh); // Устанавливаем данные в состояние
        setLastPriceDate(data.recordDate); // Устанавливаем данные в состояние
      } catch (error) {
        console.error('Ошибка при получении данных о цене', error);
      }
    };

    getLastPrice();
  }, []);

  useEffect(() => {
    const getLastRefBonus = async () => {
      try {
        const data = await fetchRefBonusDefault(); // Получаем данные с сервера
        console.log('fetchRefBonusDefault', data.referral_percent_default);
        setLastRefBonus(data.referral_percent_default); // Устанавливаем данные в состояние
        setLastRefBonusDate(data.recordDate); // Устанавливаем данные в состояние
      } catch (error) {
        console.error('Ошибка при получении данных о реф.бонусе', error);
      }
    };

    getLastRefBonus();
  }, []);

  // Функция для валидации инпута цены
  const handleInputChangePrice = (value: string) => {
    // Регулярное выражение для проверки числа с максимум 8 знаками после точки
    const regex = /^\d+(\.\d{0,8})?$/;

    // Если значение не соответствует формату, отображаем ошибку
    if (!regex.test(value)) {
      setErrorPrice(
        'Цена должна быть числом с максимальной точностью до 8 знаков после запятой',
      );
    } else {
      setErrorPrice(null); // Если формат правильный, убираем ошибку
    }

    // Обновляем цену
    setPrice(value);
  };

  // Функция для валидации инпута реф.бонуса
  const handleInputChangeRefBonus = (value: string) => {
    // Регулярное выражение для проверки числа с максимум 8 знаками после точки
    const regex = /^\d+(\.\d{2})?$/;

    // Если значение не соответствует формату, отображаем ошибку
    if (!regex.test(value)) {
      setErrorRefBonus('Цена должна быть числом');
    } else {
      setErrorRefBonus(null); // Если формат правильный, убираем ошибку
    }

    // Обновляем цену
    setRefBonus(value);
  };

  // Функция для валидации и отправки данных изменения цены электричества
  const handleSavePrice = async () => {
    const priceNumber = parseFloat(price);

    if (priceNumber <= 0) {
      setErrorPrice('Цена должна быть больше нуля');
      return;
    }

    // Отправляем данные на сервер
    try {
      startTransition(async () => {
        setErrorPrice(null); // Очистить ошибку
        setPrice(''); // Очистить инпут после успешной отправки

        // Вставляем данные в таблицу через серверную функцию
        await insertElectricityPrice(priceNumber);
        const updatedPrice = await fetchElectricityPrice(); // Получаем обновленную последнюю цену
        setLastPrice(updatedPrice.pricePerKWh);
        setLastPriceDate(updatedPrice.recordDate);

        Notiflix.Notify.success('Цена успешно изменена');
      });
    } catch (error) {
      setErrorPrice('Ошибка при сохранении данных');
      Notiflix.Notify.warning('Ошибка при сохранении данных');
    }
  };

  // Функция для валидации и отправки данных изменения реф.бонуса
  const handleSaveRefBonus = async () => {
    const refBonusNumber = parseFloat(refBonus);

    if (refBonusNumber <= 0) {
      setErrorRefBonus('Реф. брнус должен быть больше нуля');
      return;
    }

    // Отправляем данные на сервер
    try {
      startTransition(async () => {
        setErrorRefBonus(null); // Очистить ошибку
        setRefBonus(''); // Очистить инпут после успешной отправки

        // Вставляем данные в таблицу через серверную функцию
        await insertRefBonusDefault(refBonusNumber);
        const updatedRefBonus = await fetchRefBonusDefault(); // Получаем обновленную последнюю цену
        setLastRefBonus(updatedRefBonus.referral_percent_default);
        setLastRefBonusDate(updatedRefBonus.recordDate);

        Notiflix.Notify.success('Реф.бонус успешно изменен');
      });
    } catch (error) {
      setErrorRefBonus('Ошибка при сохранении реф.бонуса');
      Notiflix.Notify.warning('Ошибка при сохранении реф.бонуса');
    }
  };

  return (
    <section>
      <div className='border-b-1 border-secondary py-8'>
        <div className='flex justify-between'>
          <div>
            <div className='text-white'>
              {lastPrice ? (
                <div>
                  <p>Текущая цена: {lastPrice} $</p>
                  <p>
                    Дата обновления: {new Date(lastPriceDate).toLocaleString()}
                  </p>
                </div>
              ) : (
                <p>Загрузка цены...</p>
              )}
            </div>
            <div>
              <div className='flex w-[400px] items-center justify-between'>
                <Input
                  size='lg'
                  label='Цена за 1кВт, $'
                  labelPlacement='outside-left'
                  placeholder='0.00'
                  className='w-[300px]'
                  value={price}
                  onChange={(e) =>
                    handleInputChangePrice(e.target.value.replace(',', '.'))
                  }
                  startContent={
                    <div className='pointer-events-none flex items-center'>
                      <span className='text-small text-default-400'>$</span>
                    </div>
                  }
                  isInvalid={!!errorPrice} // Проверка на наличие ошибки
                />
                <Button
                  size='lg'
                  className='bg-white'
                  onPress={handleSavePrice}
                >
                  <CloudArrowDownIcon className='h-5 w-5' />
                </Button>
                {isPending && <FullScreenSpinner />}
              </div>
              {errorPrice && (
                <div className='mt-4 text-danger'>{errorPrice}</div>
              )}
            </div>
          </div>
          <div>
            <div className='text-white'>
              {lastRefBonus ? (
                <div>
                  <p>Текущий реф.бонус: {lastRefBonus} %</p>
                  <p>
                    Дата обновления:{' '}
                    {new Date(lastRefBonusDate).toLocaleString()}
                  </p>
                </div>
              ) : (
                <p>Загрузка реф.бонуса...</p>
              )}
            </div>
            <div>
              <div className='flex w-[400px] items-center justify-between'>
                <Input
                  size='lg'
                  label='Общий реф.бонус'
                  labelPlacement='outside-left'
                  placeholder='0.00'
                  className='w-[300px]'
                  value={refBonus}
                  onChange={(e) =>
                    handleInputChangeRefBonus(e.target.value.replace(',', '.'))
                  }
                  startContent={
                    <div className='pointer-events-none flex items-center'>
                      <span className='text-small text-default-400'>%</span>
                    </div>
                  }
                  isInvalid={!!errorRefBonus} // Проверка на наличие ошибки
                />
                <Button
                  size='lg'
                  className='bg-white'
                  onPress={handleSaveRefBonus}
                >
                  <CloudArrowDownIcon className='h-5 w-5' />
                </Button>
                {isPending && <FullScreenSpinner />}
              </div>
              {errorRefBonus && (
                <div className='mt-4 text-danger'>{errorRefBonus}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
