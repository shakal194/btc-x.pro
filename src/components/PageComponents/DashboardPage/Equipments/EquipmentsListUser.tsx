'use client';
import { useState, useEffect } from 'react';
import {
  fetchAlgorithms,
  fetchEquipments,
  fetchLastBalanceShareCountUserByEquipmentId,
  fetchElectricityPrice,
} from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import { Tab, Tabs } from '@heroui/react';
import { useSession } from 'next-auth/react';
import BuySellShareCountComponent from '@/components/PageComponents/DashboardPage/Store/BuySellShareCountComponent';
import FullScreenSpinner from '@/components/ui/Spinner';

export default function EquipmentsListUser() {
  const [isLoading, setIsLoading] = useState<boolean>(false); // Флаг загрузки
  const [algorithms, setAlgorithms] = useState<any[]>([]); // Состояние для хранения алгоритмов
  const [userEquipmentsFetch, setUserEquipmentsFetch] = useState<any[]>([]);
  const { data: session } = useSession();
  const user_id = session?.user?.id;
  const [equipmentsFetch, setEquipmentsFetch] = useState<any[]>([]);
  const [lastPrice, setLastPrice] = useState<any>(null);

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

  // Получаем список всего оборудования
  const getEquipments = async () => {
    setIsLoading(true);
    try {
      const data = await fetchEquipments();
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

  // Получаем транзакции по оборудованию
  const getUserEquipment = async (user_id: string, equipmentId: number) => {
    setIsLoading(true);
    try {
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
    } catch (error) {
      console.error('Ошибка при получении данных по транзакциям', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user_id && equipmentsFetch.length > 0) {
      // Вызываем getUserEquipment для каждого оборудования
      equipmentsFetch.forEach((equipment) => {
        getUserEquipment(user_id, equipment.id);
      });
    }
  }, [user_id, equipmentsFetch]);

  // Получаем список всех алгоритмов
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

  // Группируем устройства по алгоритмам
  const groupedEquipments = algorithms.reduce((acc, algorithm) => {
    acc[algorithm.name] = equipmentsFetch.filter(
      (equipment) => equipment.algorithm_id === algorithm.id,
    );
    return acc;
  }, {});

  return (
    <section className='space-y-4'>
      <div className='text-white'>
        {lastPrice ? (
          <div>
            <p>
              Стоимость электроенергии:{' '}
              {parseFloat(lastPrice.pricePerKWh).toFixed(2)} $
            </p>
          </div>
        ) : (
          <p>Загрузка последней цены...</p>
        )}
      </div>
      <div className='text-lg text-white'>
        <ul className='space-y-4'>
          {isLoading ? (
            <FullScreenSpinner />
          ) : userEquipmentsFetch.length > 0 ? (
            userEquipmentsFetch.map((equipmentData, index) => {
              const equipment = equipmentsFetch.find(
                (equip) => equip.id === equipmentData.equipmentId,
              );

              const userBalanceShareCount =
                equipmentData.data[0].balanceShareCount;

              const devicesInUse = Math.floor(
                userBalanceShareCount / equipment.shareCount,
              );

              const sharesInUse =
                userBalanceShareCount - devicesInUse * equipment.shareCount;
              if (!equipment) return null;

              // Находим алгоритм по ID
              const algorithm = algorithms.find(
                (algo) => algo.id === equipment.algorithm_id,
              );

              const algorithmCoinTickers = algorithm?.coinTickers || [];
              const coinPrice = algorithmCoinTickers[0]?.pricePerHashrate || 0;
              const dailyIncome = coinPrice * equipment.hashrate;

              return (
                <li key={index} className='border-b-1 border-secondary p-2'>
                  <div className='flex items-center'>
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
                          width={300}
                          height={300}
                          className='h-[300px] w-[300px]'
                        />
                      )}
                    </div>
                    <div>
                      <div>
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
                          <b>Долей в работе:</b> {sharesInUse}
                        </p>
                        <p>
                          <b>Устройств в работе:</b> {devicesInUse}
                        </p>

                        <p>
                          <b>Доход в сутки одного устройства:</b>{' '}
                          {dailyIncome.toFixed(8)} {/* Рассчитываем доход */}
                        </p>
                      </div>
                      <div className='mt-4 flex gap-2'>
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
            <p>
              У вас ещё нет оборудования в данной категории.{' '}
              <Link href='/dashboard/store' className='text-success'>
                В магазин
              </Link>
            </p>
          )}
        </ul>
      </div>
    </section>
  );
}
