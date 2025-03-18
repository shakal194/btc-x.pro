'use client';
import { useState } from 'react';
import { Button, Input } from '@heroui/react';
import {
  updateTickerPricePerHashrate,
  deleteTickerFromAlgorithm,
} from '@/lib/data';
import { CloudArrowDownIcon, TrashIcon } from '@heroicons/react/24/outline';
import FullScreenSpinner from '@/components/ui/Spinner';
import Notiflix from 'notiflix';

export default function AlgorithmsList({
  algorithms,
  updateAlgorithms, // Функция для обновления алгоритмов
  isLoading,
}: {
  algorithms: any[];
  updateAlgorithms: () => void;
  isLoading: boolean;
}) {
  const [coinPrices, setCoinPrices] = useState<{ [key: string]: string }>({});
  const [priceErrors, setPriceErrors] = useState<{
    [key: string]: string | null;
  }>({});

  const handleInputChangePrice = (tickerName: string, value: string) => {
    // Регулярное выражение для проверки числа с максимум 8 знаками после точки
    const regex = /^\d+(\.\d{0,8})?$/;

    // Если значение не соответствует формату, отображаем ошибку
    if (!regex.test(value)) {
      setPriceErrors((prevErrors) => ({
        ...prevErrors,
        [tickerName]:
          'Цена должна быть числом с максимальной точностью до 8 знаков после запятой',
      }));
    } else {
      setPriceErrors((prevErrors) => ({
        ...prevErrors,
        [tickerName]: null, // Если формат правильный, убираем ошибку
      }));
    }

    // Обновляем цену
    setCoinPrices((prev) => ({
      ...prev,
      [tickerName]: value,
    }));
  };

  const handleUpdatePrice = async (
    algorithmName: string,
    tickerName: string,
  ) => {
    const newPriceNumber = parseFloat(coinPrices[tickerName]);
    if (isNaN(newPriceNumber) || newPriceNumber <= 0) {
      Notiflix.Notify.warning('Введите корректное количество монет');
      return;
    }
    try {
      await updateTickerPricePerHashrate(
        algorithmName,
        tickerName,
        newPriceNumber,
      );
      await updateAlgorithms(); // Обновляем алгоритмы после изменения цены
      setPriceErrors({});
      setCoinPrices({});
      Notiflix.Notify.success('Количество монет обновлено');
    } catch (error) {
      Notiflix.Notify.warning('Ошибка при обновлении цены');
    }
  };

  const handleDeleteTicker = async (
    tickerName: string,
    algorithmName: string,
  ) => {
    try {
      await deleteTickerFromAlgorithm(algorithmName, tickerName);
      await updateAlgorithms(); // Обновляем алгоритмы после удаления тикера
      Notiflix.Notify.success('Тикер успешно удален');
    } catch (error) {
      Notiflix.Notify.warning('Ошибка при удалении тикера');
    }
  };

  return (
    <section>
      {isLoading && <FullScreenSpinner />}
      <div className='border-t-1 border-secondary text-lg text-white'>
        <ul className='space-y-4'>
          {algorithms.length > 0 ? (
            algorithms.map((algorithm, index) => (
              <li key={index} className='border-b-1 border-secondary'>
                <div className='text-center'>
                  Алгоритм - <b>{algorithm.name}</b>
                </div>
                <div>
                  {algorithm.coinTickers.map((ticker: any, index: number) => (
                    <div
                      key={index}
                      className='mb-4 flex items-center justify-between space-y-2 py-2'
                    >
                      <div>
                        <p>Монета - {ticker.name}</p>
                        <p className='mb-2'>
                          Количество монет в сутки на ед. хешрейта -{' '}
                          {ticker.pricePerHashrate.toFixed(8)}
                        </p>
                      </div>
                      <div>
                        <div className='flex w-[400px] items-center justify-between'>
                          <Input
                            size='lg'
                            label='Количество монет'
                            labelPlacement='inside'
                            placeholder='0.00'
                            className='w-[200px]'
                            value={coinPrices[ticker.name] || ''}
                            onChange={(e) =>
                              handleInputChangePrice(
                                ticker.name,
                                e.target.value.replace(',', '.'),
                              )
                            }
                            isInvalid={!!priceErrors[ticker.name]} // Проверка на ошибку для текущего тикера
                          />
                          <Button
                            size='lg'
                            className='bg-white'
                            onPress={() =>
                              handleUpdatePrice(algorithm.name, ticker.name)
                            }
                          >
                            <CloudArrowDownIcon className='h-5 w-5' />
                          </Button>
                          <Button
                            size='lg'
                            className='bg-white'
                            onPress={() =>
                              handleDeleteTicker(ticker.name, algorithm.name)
                            }
                          >
                            <TrashIcon className='h-5 w-5' />
                          </Button>
                        </div>
                        {priceErrors[ticker.name] && (
                          <div className='text-red-500'>
                            {priceErrors[ticker.name]}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </li>
            ))
          ) : (
            <p>Алгоритмы не найдены</p>
          )}
        </ul>
      </div>
    </section>
  );
}
