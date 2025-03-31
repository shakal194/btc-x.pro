'use client';
import { useState, useEffect } from 'react';
import {
  fetchAlgorithms,
  fetchEquipments,
  fetchAllUserBalanceShares,
  fetchElectricityPrice,
  fetchReferralCodeByUserId,
  fetchAllUserBalances,
  fetchRefBalance,
} from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
//import { useSession } from 'next-auth/react';
import BuySellShareCountComponent from '@/components/PageComponents/DashboardPage/Store/BuySellShareCountComponent';
import FullScreenSpinner from '@/components/ui/Spinner';
import { EquipmentSkeleton } from '@/components/ui/Skeletons';
import { Snippet, Tabs, Tab } from '@heroui/react';

interface Equipment {
  id: number;
  name: string;
  hashrate: number;
  hashrate_unit: string;
  photoUrl: string | null;
  power: string;
  shareCount: number;
  purchasePrice: number;
  salePrice: number;
  algorithm_id: number;
  uuid: string | null;
}

interface CoinTicker {
  name: string;
  pricePerHashrate: number;
}

interface Algorithm {
  id: number;
  name: string;
  uuid: string | null;
  coinTickers: CoinTicker[] | null;
}

interface EquipmentData {
  equipmentId: number;
  balanceShareCount: number;
}

export default function EquipmentsListUser({ userId }: { userId: string }) {
  //const { data: session, status } = useSession();
  const user_id = userId;

  const [isLoading, setIsLoading] = useState<boolean>(false); // Флаг загрузки
  const [isLoadingUserEquipments, setIsLoadingUserEquipments] =
    useState<boolean>(true);
  const [algorithms, setAlgorithms] = useState<Algorithm[]>([]); // Состояние для хранения алгоритмов
  const [userEquipmentsFetch, setUserEquipmentsFetch] = useState<
    EquipmentData[]
  >([]);
  const [equipmentsFetch, setEquipmentsFetch] = useState<Equipment[]>([]);
  const [lastPrice, setLastPrice] = useState<any>(null);
  const [refCode, setRefCode] = useState<number>();
  const [refBalance, setRefBalance] = useState<number>();
  const [balances, setBalances] = useState<any[]>([]);
  const [selectedTab, setSelectedTab] = useState<string | number>(
    algorithms[0]?.name || '',
  );

  // Получаем транзакции по оборудованию
  useEffect(() => {
    if (!user_id || equipmentsFetch.length === 0) {
      console.log(
        `[Effect] Skipping fetch - no user_id or equipments. ${user_id}`,
      );
      return;
    }

    setIsLoadingUserEquipments(true);
    const controller = new AbortController();
    let isMounted = true;
    const renderCycle = Math.random();

    const fetchAllEquipments = async () => {
      try {
        // Получаем все балансы пользователя за один запрос
        const userBalanceShares = await fetchAllUserBalanceShares(
          Number(user_id),
        );

        if (!isMounted) return;

        // Фильтруем оборудование с положительным балансом
        const validEquipments = equipmentsFetch
          .map((equipment) => {
            const balanceShareCount =
              userBalanceShares[equipment.id]?.balanceShareCount || 0;
            if (balanceShareCount > 0) {
              return { equipmentId: equipment.id, balanceShareCount };
            }
            return null;
          })
          .filter((item): item is NonNullable<typeof item> => item !== null);

        setUserEquipmentsFetch(validEquipments);
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
      isMounted = false;
      controller.abort();
    };
  }, [user_id, equipmentsFetch]);

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

  useEffect(() => {
    const getRefBalance = async () => {
      try {
        if (!user_id || isNaN(Number(user_id))) {
          return;
        }

        // Получаем данные с сервера
        const data = await fetchRefBalance(Number(user_id));

        setRefBalance(data); // Устанавливаем данные в состояние
      } catch (error) {
        console.error('Ошибка при получении реферального баланса', error);
      }
    };

    // Запускаем getRefBalance только если user_id существует
    if (user_id && !isNaN(Number(user_id))) {
      getRefBalance();
    }
  }, [user_id]); // Следим за user_id

  // Функции для обновления балансов
  const updateBalances = async () => {
    if (!user_id || isNaN(Number(user_id))) return;

    const [newBalances, newRefBalance] = await Promise.all([
      fetchAllUserBalances(Number(user_id)),
      fetchRefBalance(Number(user_id)),
    ]);

    setBalances(newBalances);
    setRefBalance(newRefBalance);
  };

  // Функция для обновления данных оборудования
  const updateEquipmentData = async (user_id: string, equipmentId: number) => {
    const userBalanceShares = await fetchAllUserBalanceShares(Number(user_id));
    const balanceShareCount =
      userBalanceShares[equipmentId]?.balanceShareCount || 0;

    setUserEquipmentsFetch((prevState) => {
      if (balanceShareCount === 0) {
        return prevState.filter((item) => item.equipmentId !== equipmentId);
      }

      const existingIndex = prevState.findIndex(
        (item) => item.equipmentId === equipmentId,
      );

      if (existingIndex !== -1) {
        const newState = [...prevState];
        newState[existingIndex] = { equipmentId, balanceShareCount };
        return newState;
      }

      return [...prevState, { equipmentId, balanceShareCount }];
    });

    // Обновляем балансы после обновления оборудования
    await updateBalances();

    return balanceShareCount;
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

  // Получаем список всех алгоритмов
  useEffect(() => {
    const getAlgorithms = async () => {
      try {
        const data = await fetchAlgorithms();
        setAlgorithms(data);
        // Устанавливаем первый таб как активный, если есть алгоритмы
        if (data.length > 0) {
          setSelectedTab(data[0].name);
        }
      } catch (error) {
        console.error('Ошибка при получении алгоритмов', error);
      }
    };

    getAlgorithms();
  }, []);

  // Add new useEffect for fetching balances
  useEffect(() => {
    const getBalances = async () => {
      try {
        if (!user_id || isNaN(Number(user_id))) {
          return;
        }
        const data = await fetchAllUserBalances(Number(user_id));
        setBalances(data);
      } catch (error) {
        console.error('Ошибка при получении балансов', error);
      }
    };

    if (user_id && !isNaN(Number(user_id))) {
      getBalances();
    }
  }, [user_id]);

  const getReferralLink = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return `${origin}/signin?tab=signup&ref=${refCode}`;
  };

  const handleCopyFullLink = () => {
    const fullLink = getReferralLink();
    navigator.clipboard.writeText(fullLink);
  };

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
              <div className='mb-4'>
                <h3 className='mb-2 text-white'>
                  Ваш реферальный код:{' '}
                  <Snippet
                    color='warning'
                    className='bg-inherit'
                    size='lg'
                    hideSymbol={true}
                  >
                    {refCode}
                  </Snippet>
                </h3>
                <h3 className='mb-2 text-white'>
                  Ваша реферальная ссылка:{' '}
                  <div
                    className='inline-block cursor-pointer'
                    onClick={handleCopyFullLink}
                  >
                    <Snippet
                      color='warning'
                      className='bg-inherit'
                      size='lg'
                      hideSymbol={true}
                      onClick={handleCopyFullLink}
                    >
                      {getReferralLink()}
                    </Snippet>
                  </div>
                </h3>
                <h3>
                  Ваш реферальный баланс - $
                  <b>
                    <u>{refBalance}</u>
                  </b>
                </h3>
              </div>
            ) : (
              <p className='text-white'>Загрузка реферального кода...</p>
            )}

            {/* Price and Assets Section */}
            <div className='flex flex-col justify-between gap-4 lg:flex-row'>
              <div className='flex flex-col gap-2'>
                <div className='flex items-center gap-2'>
                  <span>Стоимость электроэнергии</span>
                  <span className='font-bold'>
                    $
                    {lastPrice
                      ? parseFloat(lastPrice.pricePerKWh).toFixed(4)
                      : '0.0000'}{' '}
                    /кВт
                  </span>
                </div>
                <div className='flex flex-col'>
                  <span>Всего активов</span>
                  <div className='flex items-center gap-2'>
                    <span className='text-2xl font-bold'>
                      $
                      {Number(
                        balances.find((b) => b.coinTicker === 'USDT')
                          ?.coinAmount || 0,
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className='flex flex-col gap-4 md:min-w-[350px]'>
                {balances.map((balance) => (
                  <div
                    key={balance.id}
                    className='flex items-center justify-between'
                  >
                    <div className='flex items-center gap-2'>
                      <span>{balance.coinTicker}</span>
                      <span className='font-bold'>
                        {Number(balance.coinAmount).toFixed(2)}
                      </span>
                    </div>
                    <div className='flex gap-2'>
                      <button className='rounded bg-blue-500 px-3 py-1 text-sm hover:bg-blue-600'>
                        Вывести
                      </button>
                      <button className='rounded bg-green-500 px-3 py-1 text-sm hover:bg-green-600'>
                        Пополнить
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs and Equipment Section */}
          <div className='text-lg text-white'>
            <Tabs
              selectedKey={selectedTab}
              variant='underlined'
              color='warning'
              onSelectionChange={(key) => setSelectedTab(key)}
              className='gap-2'
            >
              {algorithms.map((algorithm: Algorithm) => (
                <Tab key={algorithm.name} title={algorithm.name}>
                  <ul className='space-y-4'>
                    {isLoadingUserEquipments
                      ? Array.from({ length: 3 }).map((_, index) => (
                          <EquipmentSkeleton key={index} />
                        ))
                      : (() => {
                          const algorithmEquipment = userEquipmentsFetch
                            .map((equipmentData: EquipmentData) => {
                              const equipment = equipmentsFetch.find(
                                (equip: Equipment) =>
                                  equip.id === equipmentData.equipmentId,
                              );
                              return equipment?.algorithm_id === algorithm.id
                                ? ({ equipment, equipmentData } as const)
                                : null;
                            })
                            .filter(
                              (
                                item,
                              ): item is {
                                equipment: Equipment;
                                equipmentData: EquipmentData;
                              } => item !== null,
                            );

                          if (algorithmEquipment.length === 0) {
                            return (
                              <p>
                                У вас ещё нет оборудования в данной категории.{' '}
                                <Link
                                  href='/dashboard/store'
                                  className='text-success'
                                >
                                  В магазин
                                </Link>
                              </p>
                            );
                          }

                          return algorithmEquipment.map(
                            ({ equipment, equipmentData }, index) => {
                              const userBalanceShareCount =
                                equipmentData.balanceShareCount;
                              const devicesInUse = Math.floor(
                                userBalanceShareCount / equipment.shareCount,
                              );
                              const sharesInUse =
                                userBalanceShareCount -
                                devicesInUse * equipment.shareCount;

                              const algorithmCoinTickers =
                                algorithm?.coinTickers || [];
                              const coinPrice =
                                algorithmCoinTickers[0]?.pricePerHashrate || 0;
                              const dailyIncome =
                                coinPrice * equipment.hashrate;

                              return (
                                <li
                                  key={index}
                                  className='border-b-1 border-secondary p-2'
                                >
                                  <div className='flex flex-col items-center gap-4 md:flex-row'>
                                    <div className='mr-4'>
                                      <p>
                                        <b>
                                          {equipment.name} {equipment.hashrate}{' '}
                                          {equipment.hashrate_unit}
                                        </b>
                                      </p>
                                      {equipment.photoUrl &&
                                        equipment.photoUrl !== null && (
                                          <Image
                                            src={equipment.photoUrl.replace(
                                              /^public/,
                                              '',
                                            )}
                                            alt={equipment.name}
                                            width={350}
                                            height={350}
                                            className='h-[350px] w-[350px]'
                                          />
                                        )}
                                    </div>
                                    <div>
                                      <div className='flex flex-col gap-2'>
                                        <p>
                                          <b>Алгоритм:</b> {algorithm.name}
                                        </p>
                                        <p>
                                          <b>Мощность:</b> {equipment.power} кВт
                                        </p>
                                        <p>
                                          <b>Доли:</b> {equipment.shareCount}
                                        </p>
                                        <p>
                                          <b>Цена покупки:</b> $
                                          {equipment.purchasePrice}
                                        </p>
                                        <p>
                                          <b>Цена продажи:</b> $
                                          {equipment.salePrice}
                                        </p>
                                        <p>
                                          <b>Долей в работе:</b> {sharesInUse}
                                        </p>
                                        <p>
                                          <b>Устройств в работе:</b>{' '}
                                          {devicesInUse}
                                        </p>
                                        <p>
                                          <b>
                                            Доход в сутки одного устройства:
                                          </b>{' '}
                                          {dailyIncome.toFixed(8)}
                                        </p>
                                      </div>
                                      <div className='mt-4 flex justify-between gap-2'>
                                        <BuySellShareCountComponent
                                          equipmentId={equipment.id}
                                          equipmentUuid={equipment.uuid}
                                          updateEquipmentData={
                                            updateEquipmentData
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              );
                            },
                          );
                        })()}
                  </ul>
                </Tab>
              ))}
            </Tabs>
          </div>
        </>
      )}
    </section>
  );
}
