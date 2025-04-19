'use client';
import { useState, useEffect, useCallback } from 'react';
import {
  fetchAlgorithms,
  fetchEquipments,
  fetchAllUserBalanceShares,
  fetchElectricityPrice,
  fetchAllUserBalances,
  fetchRefBalance,
  fetchMiningStats,
  getUserUuidById,
} from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import BuySellShareCountComponent from '@/components/PageComponents/DashboardPage/Equipments/BuySellShareCountComponent';
import FullScreenSpinner from '@/components/ui/Spinner';
import { Tabs, Tab, Button, Card, CardHeader, CardBody } from '@heroui/react';
import DepositModal from '../Wallet/DepositModal';
import WithdrawModal from '../Wallet/WithdrawModal';
import { EquipmentSkeleton } from '@/components/ui/Skeletons';
import { useRouter } from 'next/navigation';

import { getAccessToken } from '@/lib/coinsbuy';

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

interface Algorithm {
  id: number;
  uuid: string | null;
  name: string;
  coinTickers: { name: string; pricePerHashrate: number }[] | null;
  hashrate_unit?: string | null;
}

interface EquipmentData {
  equipmentId: number;
  balanceShareCount: number;
}

interface MiningStats {
  totalMined: number;
  profit24h: number;
  mined24h: number;
}

export default function EquipmentsListUser({
  serverUserId,
  serverUserEmail,
}: EquipmentsListUserProps) {
  const { data: session } = useSession();
  const user_id = serverUserId || session?.user?.id;
  const userEmail = serverUserEmail || session?.user?.email || '';
  const [userUuid, setUserUuid] = useState<string>('');

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
  const [electricityPrice, setElectricityPrice] = useState<{
    pricePerKWh: string | null;
    recordDate: Date;
  } | null>(null);
  const [coinPrices, setCoinPrices] = useState<Record<string, number>>({});
  const [refBalance, setRefBalance] = useState<number>(0);
  const [miningStats, setMiningStats] = useState<
    Record<
      string,
      {
        totalHashrate: number;
        hashrate_unit: string;
        stats: Record<string, MiningStats>;
      }
    >
  >({});
  const router = useRouter();

  useEffect(() => {
    const getelectricityPrice = async () => {
      try {
        const data = await fetchElectricityPrice();
        setElectricityPrice(data);
      } catch (error) {
        console.error('Ошибка при получении данных о цене', error);
      }
    };

    getelectricityPrice();
  }, []);

  useEffect(() => {
    const getRefBalance = async () => {
      try {
        if (!user_id || isNaN(Number(user_id))) {
          return;
        }

        const data = await fetchRefBalance(Number(user_id));
        const numericData =
          typeof data === 'string' ? parseFloat(data) : Number(data);
        setRefBalance(numericData || 0);
      } catch (error) {
        console.error('Error getting referral balance:', error);
        setRefBalance(0);
      }
    };

    if (user_id && !isNaN(Number(user_id))) {
      getRefBalance();
    }
  }, [user_id]);

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

  const getRate = async (coinTicker: string) => {
    try {
      const token = await getAccessToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_COINSBUY_API_URL}/rates/?filter[left]=${coinTicker}&filter[right]=USDT`,
        {
          headers: {
            Authorization: `Bearer ${token.access}`,
            'Content-Type': 'application/vnd.api+json',
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to fetch rate');
      }

      const data = await response.json();
      return data.data[0].attributes.ask;
    } catch (error) {
      console.error('Error fetching rate:', error);
      return '0';
    }
  };

  useEffect(() => {
    const fetchCoinPrices = async () => {
      const prices: { [key: string]: number } = {};
      for (const algorithm of algorithms) {
        if (algorithm.coinTickers) {
          for (const coin of algorithm.coinTickers) {
            const rate = await getRate(coin.name);
            prices[coin.name] = Number(rate);
          }
        }
      }
      setCoinPrices(prices);
    };

    fetchCoinPrices();
  }, [algorithms]);

  const handleWithdrawClick = (ticker: string) => {
    setSelectedModalCoin(ticker);
    setIsWithdrawModalOpen(true);
  };

  const handleDepositClick = (ticker: string) => {
    setSelectedModalCoin(ticker);
    setIsDepositModalOpen(true);
  };

  const fetchAllMiningStats = useCallback(async () => {
    const stats: Record<
      string,
      {
        totalHashrate: number;
        hashrate_unit: string;
        stats: Record<string, MiningStats>;
      }
    > = {};

    for (const algorithm of algorithms) {
      const algorithmEquipment = userEquipmentsFetch
        .map((equipmentData) => {
          const equipment = equipments.find(
            (equip) => equip.id === equipmentData.equipmentId,
          );
          return equipment?.algorithm_id === algorithm.id
            ? { equipment, equipmentData }
            : null;
        })
        .filter(
          (
            item,
          ): item is { equipment: Equipment; equipmentData: EquipmentData } =>
            item !== null,
        );

      const totalHashrate = algorithmEquipment.reduce(
        (sum, { equipment, equipmentData }) => {
          const userBalanceShareCount = equipmentData.balanceShareCount;
          return (
            sum +
            (equipment.hashrate * userBalanceShareCount) / equipment.shareCount
          );
        },
        0,
      );

      // Получаем hashrate_unit из первого оборудования алгоритма
      const hashrate_unit =
        algorithmEquipment[0]?.equipment.hashrate_unit || '';

      const coinStats: Record<string, MiningStats> = {};

      if (algorithm.coinTickers) {
        for (const coinTicker of algorithm.coinTickers) {
          const miningData = await fetchMiningStats(
            coinTicker.name,
            Number(user_id),
          );
          coinStats[coinTicker.name] = miningData;
        }
      }

      stats[algorithm.name] = {
        totalHashrate,
        hashrate_unit,
        stats: coinStats,
      };
    }

    setMiningStats(stats);
  }, [algorithms, equipments, userEquipmentsFetch, user_id]);

  useEffect(() => {
    if (userEquipmentsFetch.length > 0) {
      fetchAllMiningStats();
    }
  }, [userEquipmentsFetch, fetchAllMiningStats]);

  // Add new useEffect for fetching UUID
  useEffect(() => {
    const fetchUserUuid = async () => {
      if (!user_id || isNaN(Number(user_id))) return;

      try {
        const uuid = await getUserUuidById(Number(user_id));
        if (uuid) {
          setUserUuid(uuid);
        }
      } catch (error) {
        console.error('Error fetching user UUID:', error);
      }
    };

    if (!userUuid) {
      fetchUserUuid();
    }
  }, [user_id, userUuid]);

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
                    {electricityPrice
                      ? parseFloat(
                          electricityPrice.pricePerKWh || '0.0000',
                        ).toFixed(4)
                      : '0.0000'}{' '}
                    $/кВт
                  </span>
                </div>{' '}
                <div>
                  <p className='mb-1 text-white'>
                    Ваш реферальный баланс: <b>${refBalance}</b>
                  </p>
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
                    className='flex items-center justify-between gap-4'
                  >
                    <div className='flex items-center gap-2'>
                      <span>{balance.coinTicker}</span>
                      <span className='font-bold'>
                        {Number(balance.coinAmount).toFixed(
                          ['USDT', 'USDC'].includes(balance.coinTicker) ? 2 : 8,
                        )}
                      </span>
                    </div>
                    <div className='flex gap-2'>
                      <Button
                        color='primary'
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
                  <Button
                    color='secondary'
                    variant='ghost'
                    onPress={() =>
                      router.push(`/dashboard/${userUuid}/mining-rewards`)
                    }
                  >
                    История начислений
                  </Button>
                  {miningStats[algorithm.name] && (
                    <div className='mb-4 flex justify-between gap-4 rounded-lg p-4'>
                      <Card className='w-[200px] border-1 border-secondary bg-default-100 shadow-md shadow-secondary'>
                        <CardHeader className='flex items-center justify-center'>
                          Хешрейт
                        </CardHeader>
                        <CardBody className='flex items-center justify-center'>
                          {miningStats[algorithm.name].totalHashrate.toFixed(2)}{' '}
                          {miningStats[algorithm.name].hashrate_unit}
                        </CardBody>
                      </Card>
                      <Card className='w-[200px] border-1 border-secondary bg-default-200 shadow-md shadow-secondary'>
                        <CardHeader className='flex items-center justify-center'>
                          Намайнено всего
                        </CardHeader>
                        <CardBody className='flex flex-col gap-2'>
                          {algorithm.coinTickers?.map((coinTicker) => (
                            <div
                              key={coinTicker.name}
                              className='flex justify-between'
                            >
                              <span>{coinTicker.name}:</span>
                              <span>
                                {miningStats[algorithm.name].stats[
                                  coinTicker.name
                                ]?.totalMined.toFixed(8)}
                              </span>
                            </div>
                          ))}
                        </CardBody>
                      </Card>
                      <Card className='w-[200px] border-1 border-secondary bg-transparent shadow-md shadow-secondary'>
                        <CardHeader className='flex items-center justify-center'>
                          Прибыль за 24ч.
                        </CardHeader>
                        <CardBody className='flex flex-col gap-2'>
                          {algorithm.coinTickers?.map((coinTicker) => (
                            <div
                              key={coinTicker.name}
                              className='flex justify-between'
                            >
                              <span>{coinTicker.name}:</span>
                              <span>
                                {miningStats[algorithm.name].stats[
                                  coinTicker.name
                                ]?.profit24h.toFixed(8)}
                              </span>
                            </div>
                          ))}
                        </CardBody>
                      </Card>
                      <Card className='w-[200px] border-1 border-secondary bg-transparent shadow-sm shadow-secondary'>
                        <CardHeader className='flex items-center justify-center'>
                          Намайнено за 24ч.
                        </CardHeader>
                        <CardBody className='flex flex-col gap-2'>
                          {algorithm.coinTickers?.map((coinTicker) => (
                            <div
                              key={coinTicker.name}
                              className='flex justify-between'
                            >
                              <span>{coinTicker.name}:</span>
                              <span>
                                {miningStats[algorithm.name].stats[
                                  coinTicker.name
                                ]?.mined24h.toFixed(8)}
                              </span>
                            </div>
                          ))}
                        </CardBody>
                      </Card>
                    </div>
                  )}

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

                            // Рассчитываем доход для всей мощности устройства
                            const dailyIncome = coinPrice * equipment.hashrate;

                            // Рассчитываем доход на одну долю с учетом всех долей
                            const dailyIncomePerShare =
                              dailyIncome /
                              (equipment.shareCount * userBalanceShareCount);

                            // Рассчитываем общий доход для всех долей пользователя
                            const totalDailyIncome =
                              dailyIncomePerShare * userBalanceShareCount;

                            // Рассчитываем затраты на электроэнергию
                            const powerPerShare: number =
                              Number(equipment.power) / equipment.shareCount;
                            const dailyPowerConsumption: number =
                              powerPerShare * userBalanceShareCount * 24;
                            const dailyElectricityCostUSD: number =
                              dailyPowerConsumption *
                              Number(electricityPrice?.pricePerKWh ?? 0);
                            const currentCoinPrice =
                              coinPrices[algorithmCoinTickers[0]?.name || ''] ??
                              0;
                            const dailyElectricityCostInCoin: number =
                              currentCoinPrice > 0
                                ? dailyElectricityCostUSD / currentCoinPrice
                                : 0;

                            // Рассчитываем доход в монете
                            const coinRevenue = totalDailyIncome;

                            // Рассчитываем прибыль
                            const profit =
                              coinRevenue - dailyElectricityCostInCoin;

                            // Проверяем, загружены ли все необходимые данные
                            const isDataLoaded =
                              equipment.power &&
                              electricityPrice?.pricePerKWh !== null &&
                              electricityPrice?.pricePerKWh !== undefined &&
                              Object.keys(coinPrices).length > 0 &&
                              userEquipmentsFetch[index] !== undefined;

                            if (!isDataLoaded) {
                              return <EquipmentSkeleton key={index} />;
                            }

                            return (
                              <li
                                key={index}
                                className='border-b-1 border-secondary p-2'
                              >
                                <div className='flex flex-col items-center gap-4 md:flex-row'>
                                  <div className='mr-4 flex flex-col items-center'>
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
                                          className='h-[350px] w-[350px] rounded-lg'
                                        />
                                      )}
                                  </div>
                                  <div>
                                    <div className='flex flex-col gap-2'>
                                      <p>
                                        <b>Мощность:</b> {equipment.power} кВт
                                      </p>
                                      <p>
                                        <b>Устройств в работе:</b>{' '}
                                        {devicesInUse}
                                      </p>
                                      <p>
                                        <b>Долей в работе:</b> {sharesInUse}
                                      </p>
                                      <p>
                                        <b>Доход в сутки всех долей:</b>
                                      </p>
                                      {algorithm.coinTickers &&
                                        algorithm.coinTickers.map(
                                          (coin: any) => {
                                            // Рассчитываем доход для всей мощности устройства
                                            const dailyIncome =
                                              coin.pricePerHashrate *
                                              equipment.hashrate;

                                            // Рассчитываем доход на одну долю с учетом всех долей
                                            const dailyIncomePerShare =
                                              dailyIncome /
                                              equipment.shareCount;

                                            // Рассчитываем общий доход для всех долей пользователя
                                            const totalDailyIncome =
                                              dailyIncomePerShare *
                                              userBalanceShareCount;

                                            // Конвертируем доход в USDT
                                            const coinPrice =
                                              coinPrices[coin.name] ?? 0;
                                            const dailyIncomeInUSDT =
                                              totalDailyIncome * coinPrice;

                                            return (
                                              <p key={coin.name}>
                                                {totalDailyIncome.toFixed(8)}{' '}
                                                {coin.name} (
                                                {dailyIncomeInUSDT.toFixed(2)}{' '}
                                                USDT)
                                              </p>
                                            );
                                          },
                                        )}
                                      <p>
                                        <b>Прибыль в сутки всех долей:</b>
                                      </p>
                                      {algorithm.coinTickers &&
                                        algorithm.coinTickers.map(
                                          (coin: any) => {
                                            // Рассчитываем доход для всей мощности устройства
                                            const dailyIncome =
                                              coin.pricePerHashrate *
                                              equipment.hashrate;

                                            // Рассчитываем доход на одну долю с учетом всех долей
                                            const dailyIncomePerShare =
                                              dailyIncome /
                                              equipment.shareCount;

                                            // Рассчитываем общий доход для всех долей пользователя
                                            const totalDailyIncome =
                                              dailyIncomePerShare *
                                              userBalanceShareCount;

                                            // Рассчитываем затраты на электроэнергию в USDT
                                            const powerPerShare: number =
                                              Number(equipment.power) /
                                              equipment.shareCount;
                                            const dailyPowerConsumption: number =
                                              powerPerShare *
                                              userBalanceShareCount *
                                              24;
                                            const dailyElectricityCostUSD: number =
                                              dailyPowerConsumption *
                                              Number(
                                                electricityPrice?.pricePerKWh ??
                                                  0,
                                              );

                                            // Конвертируем доход в USDT
                                            const coinPrice =
                                              coinPrices[coin.name] ?? 0;
                                            const dailyIncomeInUSDT =
                                              totalDailyIncome * coinPrice;

                                            const dailyElectricityCostInCoin: number =
                                              currentCoinPrice > 0
                                                ? dailyElectricityCostUSD /
                                                  currentCoinPrice
                                                : 0;

                                            // Рассчитываем прибыль
                                            const profit =
                                              totalDailyIncome -
                                              dailyElectricityCostInCoin;

                                            // Рассчитываем прибыль в USDT
                                            const profitInUSDT =
                                              dailyIncomeInUSDT -
                                              dailyElectricityCostUSD;

                                            return (
                                              <p key={coin.name}>
                                                {profit.toFixed(8)} {coin.name}{' '}
                                                ({profitInUSDT.toFixed(2)} USDT)
                                              </p>
                                            );
                                          },
                                        )}
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
          userEmail={userEmail}
          coinTicker={selectedModalCoin}
        />
      )}
    </section>
  );
}
