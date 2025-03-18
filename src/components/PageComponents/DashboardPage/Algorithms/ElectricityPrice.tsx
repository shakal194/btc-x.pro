'use client';

import { useState, useEffect, useTransition } from 'react';
import { Input, Button } from '@heroui/react';
import FullScreenSpinner from '@/components/ui/Spinner';
import { CloudArrowDownIcon } from '@heroicons/react/24/outline';
import { fetchElectricityPrice, insertElectricityPrice } from '@/lib/data'; // Импортируем функцию из data.ts
import Notiflix from 'notiflix';

export default function ElectricityPrice() {
  const [isPending, startTransition] = useTransition();

  const [lastPrice, setLastPrice] = useState<any>(null);
  const [price, setPrice] = useState(''); // Состояние для хранения введённой цены
  const [errorPrice, setErrorPrice] = useState<string | null>(null); // Для ошибки валидации

  useEffect(() => {
    const getLastPrice = async () => {
      try {
        const data = await fetchElectricityPrice(); // Получаем данные с сервера
        setLastPrice(data); // Устанавливаем данные в состояние
      } catch (error) {
        console.error('Ошибка при получении данных о цене', error);
      }
    };

    getLastPrice();
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

  // Функция для валидации и отправки данных
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
        setLastPrice(updatedPrice);

        Notiflix.Notify.success('Цена успешно изменена');
      });
    } catch (error) {
      setErrorPrice('Ошибка при сохранении данных');
      Notiflix.Notify.warning('Ошибка при сохранении данных');
    }
  };

  return (
    <section>
      <div className='border-b-1 border-secondary py-8'>
        <div className='text-white'>
          {lastPrice ? (
            <div>
              <p>Последняя цена: {lastPrice.pricePerKWh} $</p>
              <p>
                Дата обновления:{' '}
                {new Date(lastPrice.recordDate).toLocaleString()}
              </p>
            </div>
          ) : (
            <p>Загрузка последней цены...</p>
          )}
        </div>
        <div>
          <div className='flex w-[500px] items-center justify-between'>
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
            <Button size='lg' className='bg-white' onPress={handleSavePrice}>
              <CloudArrowDownIcon className='h-5 w-5' />
            </Button>
            {isPending && <FullScreenSpinner />}
          </div>
          {errorPrice && <div className='mt-4 text-red-500'>{errorPrice}</div>}
        </div>
      </div>
    </section>
  );
}
