'use client';
import { useState, useEffect } from 'react';
import {
  fetchAlgorithms,
  fetchEquipments,
  fetchLastBalanceShareCountUserByEquipmentId,
  fetchElectricityPrice,
  fetchReferralCodeByUserId,
} from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import BuySellShareCountComponent from '@/components/PageComponents/DashboardPage/Store/BuySellShareCountComponent';
import FullScreenSpinner from '@/components/ui/Spinner';
import { EquipmentSkeleton } from '@/components/ui/Skeletons';

export default function EquipmentsListUser() {
  const [isLoading, setIsLoading] = useState<boolean>(false); // Флаг загрузки
  const [isLoadingUserEquipments, setIsLoadingUserEquipments] =
    useState<boolean>(true);
  const [algorithms, setAlgorithms] = useState<any[]>([]); // Состояние для хранения алгоритмов
  const [userEquipmentsFetch, setUserEquipmentsFetch] = useState<any[]>([]);
  const { data: session } = useSession();
  const user_id = session?.user?.id;
  const [equipmentsFetch, setEquipmentsFetch] = useState<any[]>([]);
  const [lastPrice, setLastPrice] = useState<any>(null);
  const [refCode, setRefCode] = useState<number>();

  useEffect(() => {
    const getRefCode = async () => {
      try {
        if (!user_id || isNaN(Number(user_id))) {
          return;
        }

        // Получаем данные с сервера
        const data = await fetchReferralCodeByUserId(Number(user_id));

        setRefCode(data.referral_code); // Устанавливаем данные в состояние
      } catch (error) {
        console.error('Ошибка при получении реферального кода', error);
      }
    };

    // Запускаем getRefCode только если user_id существует
    if (user_id && !isNaN(Number(user_id))) {
      getRefCode();
    }
  }, [user_id]); // Следим за user_id

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
    const balanceShareCount = await fetchLastBalanceShareCountUserByEquipmentId(
      Number(user_id),
      equipmentId,
    );

    if (balanceShareCount === null) return; // Пропускаем оборудование без баланса

    setUserEquipmentsFetch((prevState) => {
      const existingDataIndex = prevState.findIndex(
        (item) => item.equipmentId === equipmentId,
      );

      if (existingDataIndex !== -1) {
        const updatedState = [...prevState];
        updatedState[existingDataIndex] = {
          equipmentId,
          balanceShareCount,
        };
        return updatedState;
      }

      return [...prevState, { equipmentId, balanceShareCount }];
    });
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
  useEffect(() => {
    if (!user_id || equipmentsFetch.length === 0) {
      console.log('[Effect] Skipping fetch - no user_id or equipments');
      return;
    }

    setIsLoadingUserEquipments(true);
    const controller = new AbortController();
    let isMounted = true;
    const renderCycle = Math.random(); // Уникальный идентификатор для каждого рендера
    console.log(
      `[Effect ${renderCycle}] Starting fetch for ${equipmentsFetch.length} equipments`,
    );

    const fetchAllEquipments = async () => {
      try {
        const fetchPromises = equipmentsFetch.map(async (equipment) => {
          if (!isMounted) return;

          console.log(
            `[Component ${renderCycle}] Fetching data for equipment ${equipment.id}`,
          );
          const balanceShareCount =
            await fetchLastBalanceShareCountUserByEquipmentId(
              Number(user_id),
              equipment.id,
            );

          if (!isMounted) return;

          if (balanceShareCount === null) {
            console.log(
              `[Component ${renderCycle}] Skipping equipment ${equipment.id} - no balance`,
            );
            return null;
          }

          return { equipmentId: equipment.id, balanceShareCount };
        });

        const results = await Promise.all(fetchPromises);

        if (!isMounted) return;

        const validResults = results.filter((result) => result !== null);

        setUserEquipmentsFetch((prevState) => {
          // Создаем Map для быстрого поиска существующих записей
          const existingMap = new Map(
            prevState.map((item) => [item.equipmentId, item.balanceShareCount]),
          );

          // Проверяем, есть ли реальные изменения
          const hasChanges = validResults.some((result) => {
            if (!result) return false;
            const existingBalance = existingMap.get(result.equipmentId);
            return existingBalance !== result.balanceShareCount;
          });

          if (!hasChanges) {
            console.log(
              `[Component ${renderCycle}] No changes in equipment data, skipping update`,
            );
            return prevState;
          }

          // Создаем новый массив только с уникальными записями
          const newState = validResults.reduce(
            (acc, result) => {
              if (!result) return acc;

              const { equipmentId, balanceShareCount } = result;
              const existingBalance = existingMap.get(equipmentId);

              if (existingBalance !== undefined) {
                if (existingBalance !== balanceShareCount) {
                  console.log(
                    `[Component ${renderCycle}] Updating equipment ${equipmentId} with new balance ${balanceShareCount}`,
                  );
                  acc.push({ equipmentId, balanceShareCount });
                } else {
                  // Если баланс не изменился, сохраняем существующую запись
                  acc.push({ equipmentId, balanceShareCount: existingBalance });
                }
              } else {
                console.log(
                  `[Component ${renderCycle}] Adding new equipment ${equipmentId} with balance ${balanceShareCount}`,
                );
                acc.push({ equipmentId, balanceShareCount });
              }

              return acc;
            },
            [] as Array<{ equipmentId: number; balanceShareCount: number }>,
          );

          return newState;
        });

        console.log(
          `[Effect ${renderCycle}] All equipment data fetched successfully`,
        );
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error(
            `[Error ${renderCycle}] Ошибка при получении данных оборудования:`,
            error,
          );
        }
      } finally {
        setIsLoadingUserEquipments(false);
      }
    };

    fetchAllEquipments();

    return () => {
      console.log(`[Effect ${renderCycle}] Cleanup - aborting fetches`);
      isMounted = false;
      controller.abort();
    };
  }, [user_id, equipmentsFetch]);

  // Получаем список всех алгоритмов
  useEffect(() => {
    const getAlgorithms = async () => {
      try {
        const data = await fetchAlgorithms();
        setAlgorithms(data);
      } catch (error) {
        console.error('Ошибка при получении алгоритмов', error);
      }
    };

    getAlgorithms();
  }, []);

  return (
    <section className='space-y-4'>
      {isLoading ? (
        <div className='flex items-center justify-center'>
          <FullScreenSpinner />
        </div>
      ) : (
        <>
          <div className='text-white'>
            {refCode ? (
              <div>
                <p>Ваш реферальный код: {refCode}</p>
              </div>
            ) : (
              <p>Загрузка реферального кода...</p>
            )}
            {lastPrice ? (
              <div>
                <p>
                  Стоимость электроэнергии:{' '}
                  {parseFloat(lastPrice.pricePerKWh).toFixed(2)} $
                </p>
              </div>
            ) : (
              <p>Загрузка последней цены...</p>
            )}
          </div>
          <div className='text-lg text-white'>
            <ul className='space-y-4'>
              {isLoadingUserEquipments ? (
                // Показываем 3 скелетона во время загрузки
                Array.from({ length: 3 }).map((_, index) => (
                  <EquipmentSkeleton key={index} />
                ))
              ) : userEquipmentsFetch.length > 0 ? (
                userEquipmentsFetch.map((equipmentData, index) => {
                  const equipment = equipmentsFetch.find(
                    (equip) => equip.id === equipmentData.equipmentId,
                  );

                  const userBalanceShareCount = equipmentData.balanceShareCount;

                  const devicesInUse = Math.floor(
                    userBalanceShareCount / equipment.shareCount,
                  );

                  const sharesInUse =
                    userBalanceShareCount - devicesInUse * equipment.shareCount;
                  if (!equipment) return null;

                  const algorithm = algorithms.find(
                    (algo) => algo.id === equipment.algorithm_id,
                  );

                  const algorithmCoinTickers = algorithm?.coinTickers || [];
                  const coinPrice =
                    algorithmCoinTickers[0]?.pricePerHashrate || 0;
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
                              {dailyIncome.toFixed(8)}
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
        </>
      )}
    </section>
  );
}
