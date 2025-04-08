'use client';
import { useState, useEffect, useCallback } from 'react';
import {
  fetchAlgorithms,
  fetchEquipments,
  fetchAllUserBalanceShares,
  fetchElectricityPrice,
  fetchAllUserBalances,
} from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import BuySellShareCountComponent from '@/components/PageComponents/DashboardPage/Store/BuySellShareCountComponent';
import FullScreenSpinner from '@/components/ui/Spinner';
import { Tabs, Tab, Button } from '@heroui/react';
import DepositModal from '../Wallet/DepositModal';
import WithdrawModal from '../Wallet/WithdrawModal';

interface EquipmentsListUserProps {
  serverUserId: string;
  serverUserEmail: string;
}

interface Balance {
  id: number;
  coinTicker: string;
  coinAmount: string;
}

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

export default function EquipmentsListUser({
  serverUserId,
  serverUserEmail,
}: EquipmentsListUserProps) {
  const { data: session } = useSession();
  const user_id = serverUserId || session?.user?.id;
  const userEmail = serverUserEmail || session?.user?.email || '';

  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('');
  const [selectedModalCoin, setSelectedModalCoin] = useState<string>('');
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [balances, setBalances] = useState<Balance[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingUserEquipments, setIsLoadingUserEquipments] =
    useState<boolean>(true);
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [algorithms, setAlgorithms] = useState<Algorithm[]>([]);
  const [userEquipmentsFetch, setUserEquipmentsFetch] = useState<
    EquipmentData[]
  >([]);
  const [lastPrice, setLastPrice] = useState<{
    pricePerKWh: string | null;
    recordDate: Date;
  } | null>(null);

  useEffect(() => {
    const getLastPrice = async () => {
      try {
        const data = await fetchElectricityPrice();
        setLastPrice(data);
      } catch (error) {
        console.error('Ошибка при получении данных о цене', error);
      }
    };

    getLastPrice();
  }, []);

  const getBalances = useCallback(async () => {
    try {
      if (!user_id) return;
      const balancesData = await fetchAllUserBalances(Number(user_id));
      setBalances(balancesData);
    } catch (error) {
      console.error('Error fetching balances:', error);
    }
  }, [user_id]);

  useEffect(() => {
    if (user_id && !isNaN(Number(user_id))) {
      getBalances();
    }
  }, [user_id, getBalances]);

  useEffect(() => {
    if (!user_id || equipments.length === 0) {
      return;
    }

    setIsLoadingUserEquipments(true);
    const controller = new AbortController();
    let isMounted = true;
    const renderCycle = Math.random();

    const fetchAllEquipments = async () => {
      try {
        const userBalanceShares = await fetchAllUserBalanceShares(
          Number(user_id),
        );

        if (!isMounted) return;

        const validEquipments = equipments
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

        if (validEquipments.length > 0 && algorithms.length > 0) {
          const firstPurchasedAlgorithm = algorithms.find((algorithm) =>
            validEquipments.some(
              (equipment) =>
                equipments.find((e) => e.id === equipment.equipmentId)
                  ?.algorithm_id === algorithm.id,
            ),
          );

          if (firstPurchasedAlgorithm) {
            setSelectedAlgorithm(firstPurchasedAlgorithm.name);
          }
        } else if (algorithms.length > 0) {
          setSelectedAlgorithm(algorithms[0].name);
        }
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
  }, [user_id, equipments, algorithms]);

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

    await getBalances();

    return balanceShareCount;
  };

  const getEquipments = async () => {
    setIsLoading(true);
    try {
      const data = await fetchEquipments();
      setEquipments(data);
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

  const handleWithdrawClick = (ticker: string) => {
    setSelectedModalCoin(ticker);
    setIsWithdrawModalOpen(true);
  };

  const handleDepositClick = (ticker: string) => {
    setSelectedModalCoin(ticker);
    setIsDepositModalOpen(true);
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
            <div className='flex flex-col justify-between gap-4 lg:flex-row'>
              <div className='flex flex-col gap-2'>
                <div className='flex items-center gap-2'>
                  <span>Стоимость электроэнергии</span>
                  <span className='font-bold'>
                    $
                    {lastPrice
                      ? parseFloat(lastPrice.pricePerKWh || '0.0000').toFixed(4)
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
                      <Button
                        color='default'
                        onPress={() => handleWithdrawClick(balance.coinTicker)}
                      >
                        Вывести
                      </Button>
                      <Button
                        color='success'
                        className='text-white'
                        onPress={() => handleDepositClick(balance.coinTicker)}
                      >
                        Пополнить
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className='text-lg text-white'>
            <Tabs
              selectedKey={selectedAlgorithm}
              variant='underlined'
              color='warning'
              onSelectionChange={(key) => setSelectedAlgorithm(String(key))}
              className='gap-2'
            >
              {algorithms.map((algorithm: Algorithm) => (
                <Tab key={algorithm.name} title={algorithm.name}>
                  <ul className='space-y-4'>
                    {isLoadingUserEquipments ? (
                      <div className='flex min-h-[200px] items-center justify-center'>
                        <FullScreenSpinner />
                      </div>
                    ) : (
                      (() => {
                        const algorithmEquipment = userEquipmentsFetch
                          .map((equipmentData: EquipmentData) => {
                            const equipment = equipments.find(
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
                            const dailyIncome = coinPrice * equipment.hashrate;

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
                                        <b>Доход в сутки одного устройства:</b>{' '}
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
                      })()
                    )}
                  </ul>
                </Tab>
              ))}
            </Tabs>
          </div>
        </>
      )}

      {isWithdrawModalOpen && (
        <WithdrawModal
          isOpen={isWithdrawModalOpen}
          onClose={() => setIsWithdrawModalOpen(false)}
          onSuccess={() => {
            setIsWithdrawModalOpen(false);
            getBalances();
          }}
          userId={Number(user_id)}
          userEmail={userEmail}
          coinTicker={selectedModalCoin}
          balance={parseFloat(
            balances.find((b) => b.coinTicker === selectedModalCoin)
              ?.coinAmount || '0',
          )}
        />
      )}

      {isDepositModalOpen && (
        <DepositModal
          isOpen={isDepositModalOpen}
          onClose={() => {
            setIsDepositModalOpen(false);
            getBalances();
          }}
          userId={Number(user_id)}
          coinTicker={selectedModalCoin}
        />
      )}
    </section>
  );
}
