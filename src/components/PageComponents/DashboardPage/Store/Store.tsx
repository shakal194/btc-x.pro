'use client';
import { useState, useEffect } from 'react';
import {
  fetchEquipments,
  fetchAlgorithms,
  fetchLastBalanceShareCountUserByEquipmentId,
} from '@/lib/data';
import Image from 'next/image';
import BuySellShareCountComponent from '@/components/PageComponents/DashboardPage/Store/BuySellShareCountComponent';

export default function Store() {
  const [isLoading, setIsLoading] = useState<boolean>(false); // Флаг загрузки
  const [algorithms, setAlgorithms] = useState<any[]>([]); // Состояние для хранения алгоритмов
  const [equipmentsFetch, setEquipmentsFetch] = useState<any[]>([]);
  const [userEquipmentsFetch, setUserEquipmentsFetch] = useState<any[]>([]);

  // Функция для обновления данных оборудования
  const updateEquipmentData = async (user_id: string, equipmentId: number) => {
    const data = await fetchLastBalanceShareCountUserByEquipmentId(
      Number(user_id),
      equipmentId,
    );
    if (data !== 0) {
      // Обновляем состояние, проверяя наличие данных с таким же equipmentId
      setUserEquipmentsFetch((prevState) => {
        // Проверяем, есть ли уже данные с таким equipmentId
        const existingDataIndex = prevState.findIndex(
          (item) => item.equipmentId === equipmentId,
        );

        // Если данные с таким id есть, обновляем их
        if (existingDataIndex !== -1) {
          const updatedState = [...prevState];
          updatedState[existingDataIndex] = {
            equipmentId,
            data,
          };
          return updatedState;
        }

        // Если данных с таким id нет, добавляем новые
        return [...prevState, { equipmentId, data }];
      });
    }
  };

  //Получаем список всего оборудования
  const getEquipments = async () => {
    setIsLoading(true);
    try {
      const data = await fetchEquipments(); // Получаем данные с сервера

      setEquipmentsFetch(data);
      return data;
    } catch (error) {
      console.error('Ошибка при получении данных по алгоритмам', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getEquipments();
  }, []);

  //Получаем список всех алгоритмов
  useEffect(() => {
    const getAlgorithms = async () => {
      try {
        const data = await fetchAlgorithms();
        setAlgorithms(data); // Сохраняем алгоритмы в состояние
      } catch (error) {
        console.error('Ошибка при получении алгоритмов', error);
      }
    };

    getAlgorithms();
  }, []);

  return (
    <section className='space-y-4'>
      <div className='text-lg text-white'>
        <ul className='space-y-4'>
          {isLoading ? (
            <p>Загрузка оборудования...</p>
          ) : equipmentsFetch.length > 0 ? (
            equipmentsFetch.map((equipment, index) => {
              // Находим алгоритм по ID
              const algorithm = algorithms.find(
                (algo) => algo.id === equipment.algorithm_id,
              );

              const algorithmCoinTickers = algorithm?.coinTickers || [];
              const coinPrice = algorithmCoinTickers[0]?.pricePerHashrate || 0;
              const dailyIncome = coinPrice * equipment.hashrate;

              return (
                <li key={index} className='border-b-1 border-secondary p-2'>
                  <div className='flex flex-col items-center gap-4 md:flex-row'>
                    <div className='mr-4'>
                      <p>
                        <b>
                          {equipment.name} {equipment.hashrate}
                          {equipment.hashrate_unit}
                        </b>
                      </p>
                      {equipment.photoUrl && (
                        <Image
                          src={equipment.photoUrl.replace(/^public/, '')}
                          alt={equipment.name}
                          width={350}
                          height={300}
                          className='h-[350px] w-[350px]'
                        />
                      )}
                    </div>
                    <div>
                      <div className='flex flex-col gap-2'>
                        <p>
                          <b>Алгоритм:</b>{' '}
                          {algorithm ? algorithm.name : 'Не найден'}
                        </p>
                        <p>
                          <b>Мощность:</b> {equipment.power} кВт
                        </p>
                        <p>
                          <b>Доли:</b> {equipment.shareCount}
                        </p>
                        <p>
                          <b>Цена покупки:</b> ${equipment.purchasePrice}
                        </p>
                        <p>
                          <b>Цена продажи:</b> ${equipment.salePrice}
                        </p>
                        <p>
                          <b>Доход в сутки одного устройства:</b>{' '}
                          {dailyIncome.toFixed(8)}
                        </p>
                      </div>
                      <div className='mt-4 flex justify-between gap-2'>
                        <BuySellShareCountComponent
                          equipmentId={equipment.id}
                          equipmentUuid={equipment.uuid}
                          updateEquipmentData={updateEquipmentData}
                        />
                      </div>
                    </div>
                  </div>
                </li>
              );
            })
          ) : (
            <p>Оборудование не найдено</p>
          )}
        </ul>
      </div>
    </section>
  );
}
