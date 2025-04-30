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
  calculateTotalBalanceInUSDT,
} from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import BuySellShareCountComponent from '@/components/PageComponents/DashboardPage/Equipments/BuySellShareCountComponent';
import FullScreenSpinner from '@/components/ui/Spinner';
import { Tabs, Tab, Button, Card, CardHeader, CardBody } from '@heroui/react';
import DepositModal from '../Wallet/DepositModal';
import WithdrawModal from '../Wallet/WithdrawModal';
import {
  EquipmentSkeleton,
  MiningRewardsSkeleton,
} from '@/components/ui/Skeletons';
import { useRouter } from 'next/navigation';

import { getAccessToken } from '@/lib/coinsbuy';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { Tooltip } from '@heroui/react';

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
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [isLoadingMiningStats, setIsLoadingMiningStats] =
    useState<boolean>(true);

  useEffect(() => {
    const initializeAllData = async () => {
      if (!user_id || isNaN(Number(user_id))) return;

      setIsLoading(true);
      setIsLoadingMiningStats(true);
      setIsLoadingUserEquipments(true);

      try {
        // 1. Загружаем базовые данные параллельно
        const [
          equipmentsData,
          algorithmsData,
          electricityPriceData,
          balancesData,
          refBalanceData,
          userUuidData,
          totalBalanceData,
        ] = await Promise.all([
          fetchEquipments(),
          fetchAlgorithms(),
          fetchElectricityPrice(),
          fetchAllUserBalances(Number(user_id)),
          fetchRefBalance(Number(user_id)),
          getUserUuidById(Number(user_id)),
          calculateTotalBalanceInUSDT(Number(user_id)),
        ]);

        // Устанавливаем полученные данные
        setEquipments(equipmentsData);
        setAlgorithms(algorithmsData);
        setElectricityPrice(electricityPriceData);
        setBalances(balancesData);
        setRefBalance(
          typeof refBalanceData === 'string'
            ? parseFloat(refBalanceData)
            : Number(refBalanceData),
        );
        setUserUuid(userUuidData || '');
        setTotalBalance(totalBalanceData);

        // Убираем общий спиннер после загрузки базовых данных
        setIsLoading(false);

        // 2. После получения оборудования и алгоритмов, загружаем данные пользователя
        const userBalanceShares = await fetchAllUserBalanceShares(
          Number(user_id),
        );

        const validEquipments = equipmentsData
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
        setIsLoadingUserEquipments(false);

        // 3. Устанавливаем начальный выбранный алгоритм
        if (validEquipments.length > 0 && algorithmsData.length > 0) {
          const firstPurchasedAlgorithm = algorithmsData.find((algorithm) =>
            validEquipments.some(
              (equipment) =>
                equipmentsData.find((e) => e.id === equipment.equipmentId)
                  ?.algorithm_id === algorithm.id,
            ),
          );

          if (firstPurchasedAlgorithm) {
            setSelectedAlgorithm(firstPurchasedAlgorithm.name);
          }
        } else if (algorithmsData.length > 0) {
          setSelectedAlgorithm(algorithmsData[0].name);
        }

        // 4. Загружаем цены монет
        const prices: { [key: string]: number } = {};
        for (const algorithm of algorithmsData) {
          if (algorithm.coinTickers) {
            for (const coin of algorithm.coinTickers) {
              const rate = await getRate(coin.name);
              prices[coin.name] = Number(rate);
            }
          }
        }
        setCoinPrices(prices);
      } catch (error) {
        console.error('Ошибка при инициализации данных:', error);
        setIsLoading(false);
        setIsLoadingUserEquipments(false);
        setIsLoadingMiningStats(false);
      }
    };

    initializeAllData();
  }, [user_id]);

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
      // Получаем оборудование для текущего алгоритма
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

      // Получаем hashrate_unit из первого доступного оборудования алгоритма
      const hashrate_unit =
        equipments.find((e) => e.algorithm_id === algorithm.id)
          ?.hashrate_unit || '';

      // Считаем текущий хешрейт только если есть активное оборудование
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

      const coinStats: Record<string, MiningStats> = {};

      // Получаем статистику майнинга для всех монет алгоритма
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
    setIsLoadingMiningStats(false);
  }, [algorithms, equipments, userEquipmentsFetch, user_id]);

  useEffect(() => {
    // Запускаем получение статистики даже если нет активного оборудования
    fetchAllMiningStats();
  }, [userEquipmentsFetch, fetchAllMiningStats]);

  const updateEquipmentData = useCallback(
    async (userId: string, equipmentId: number): Promise<number> => {
      try {
        // Получаем все необходимые данные
        const [userBalanceShares, balancesData, totalBalanceData] =
          await Promise.all([
            fetchAllUserBalanceShares(Number(userId)),
            fetchAllUserBalances(Number(userId)),
            calculateTotalBalanceInUSDT(Number(userId)),
          ]);

        // Обновляем состояние долей пользователя
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

        // Обновляем все состояния
        setUserEquipmentsFetch(validEquipments);
        setBalances(balancesData);
        setTotalBalance(totalBalanceData);

        return totalBalanceData;
      } catch (error) {
        console.error('Error updating equipment data:', error);
        return 0;
      }
    },
    [equipments],
  );

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
                      ${totalBalance.toFixed(2)}
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
                          ['USDT', 'USDC', 'USDT_SOL', 'USDC_SOL'].includes(
                            balance.coinTicker,
                          )
                            ? 2
                            : 8,
                        )}
                      </span>
                    </div>
                    <div className='flex gap-2'>
                      <Button
                        color='success'
                        className='text-white'
                        onPress={() => handleDepositClick(balance.coinTicker)}
                      >
                        Пополнить
                      </Button>
                      <Button
                        color='primary'
                        onPress={() => handleWithdrawClick(balance.coinTicker)}
                      >
                        Вывести
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
                  {isLoadingMiningStats || !miningStats[algorithm.name] ? (
                    <MiningRewardsSkeleton />
                  ) : (
                    <div className='mb-4 grid grid-cols-1 gap-4 rounded-lg p-4 md:grid-cols-2 md:justify-between xl:grid-cols-4'>
                      <Card className='border-1 border-secondary bg-warning-100/50 shadow-md shadow-secondary'>
                        <CardHeader className='flex items-center justify-center'>
                          Хешрейт
                        </CardHeader>
                        <CardBody className='flex items-center justify-center'>
                          {miningStats[algorithm.name]?.totalHashrate > 0
                            ? `${miningStats[algorithm.name].totalHashrate.toFixed(2)} ${miningStats[algorithm.name].hashrate_unit}`
                            : 'N/A'}
                        </CardBody>
                      </Card>
                      <Card className='border-1 border-secondary bg-warning-200/50 shadow-md shadow-secondary'>
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
                                {miningStats[algorithm.name]?.stats[
                                  coinTicker.name
                                ]?.totalMined > 0
                                  ? miningStats[algorithm.name].stats[
                                      coinTicker.name
                                    ].totalMined.toFixed(8)
                                  : 'N/A'}
                              </span>
                            </div>
                          ))}
                        </CardBody>
                      </Card>
                      <Card className='border-1 border-secondary bg-warning-300/50 shadow-md shadow-secondary'>
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
                                {miningStats[algorithm.name]?.stats[
                                  coinTicker.name
                                ]?.mined24h > 0
                                  ? miningStats[algorithm.name].stats[
                                      coinTicker.name
                                    ].mined24h.toFixed(8)
                                  : 'N/A'}
                              </span>
                            </div>
                          ))}
                        </CardBody>
                      </Card>
                      <Card className='border-1 border-secondary bg-warning-400/50 shadow-md shadow-secondary'>
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
                                {miningStats[algorithm.name]?.stats[
                                  coinTicker.name
                                ]?.profit24h > 0
                                  ? miningStats[algorithm.name].stats[
                                      coinTicker.name
                                    ].profit24h.toFixed(8)
                                  : 'N/A'}
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
                        <EquipmentSkeleton />
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
                            <p className='mt-4'>
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
                                    <p className='text-center'>
                                      <b>
                                        {equipment.name} {equipment.hashrate}{' '}
                                        {equipment.hashrate_unit}
                                      </b>
                                    </p>
                                    {equipment.photoUrl &&
                                      equipment.photoUrl !== null && (
                                        <Image
                                          src={equipment.photoUrl}
                                          alt={equipment.name}
                                          width={450}
                                          height={450}
                                          className='h-[350px] w-[350px] rounded-lg md:h-[450px] md:w-[450px]'
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
                                        <b>Цена продажи одной доли:</b> $
                                        {equipment.salePrice /
                                          equipment.shareCount}
                                      </p>
                                      <p>
                                        <b>Цена продажи всех ваших долей:</b> $
                                        {(equipment.salePrice /
                                          equipment.shareCount) *
                                          userBalanceShareCount}
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
                                      {algorithm.coinTickers && (
                                        <div className='flex flex-col gap-2'>
                                          {(() => {
                                            // Рассчитываем общий доход в USDT от всех монет
                                            const totalIncomeUSDT =
                                              algorithm.coinTickers.reduce(
                                                (total: number, coin: any) => {
                                                  const dailyIncome =
                                                    coin.pricePerHashrate *
                                                    equipment.hashrate;
                                                  const dailyIncomePerShare =
                                                    dailyIncome /
                                                    equipment.shareCount;
                                                  const totalDailyIncome =
                                                    dailyIncomePerShare *
                                                    userBalanceShareCount;
                                                  const coinPrice =
                                                    coinPrices[coin.name] ?? 0;
                                                  return (
                                                    total +
                                                    totalDailyIncome * coinPrice
                                                  );
                                                },
                                                0,
                                              );

                                            // Рассчитываем общие затраты на электроэнергию в USDT для всех долей пользователя
                                            const powerPerShare =
                                              Number(equipment.power) /
                                              equipment.shareCount;
                                            const dailyPowerConsumption =
                                              powerPerShare *
                                              userBalanceShareCount *
                                              24;
                                            const totalElectricityCostUSDT =
                                              dailyPowerConsumption *
                                              Number(
                                                electricityPrice?.pricePerKWh ??
                                                  0,
                                              );

                                            return algorithm.coinTickers.map(
                                              (coin: any) => {
                                                // Рассчитываем доход для всех долей пользователя
                                                const dailyIncome =
                                                  coin.pricePerHashrate *
                                                  equipment.hashrate;
                                                const dailyIncomePerShare =
                                                  dailyIncome /
                                                  equipment.shareCount;
                                                const totalDailyIncome =
                                                  dailyIncomePerShare *
                                                  userBalanceShareCount;

                                                // Конвертируем в USDT
                                                const coinPrice =
                                                  coinPrices[coin.name] ?? 0;
                                                const incomeInUSDT =
                                                  totalDailyIncome * coinPrice;

                                                // Рассчитываем долю этой монеты в общем доходе
                                                const incomeShare =
                                                  totalIncomeUSDT > 0
                                                    ? incomeInUSDT /
                                                      totalIncomeUSDT
                                                    : 0;

                                                // Распределяем затраты на электричество пропорционально доходу
                                                const electricityCostForCoin =
                                                  totalElectricityCostUSDT *
                                                  incomeShare;

                                                // Конвертируем затраты в монету
                                                const electricityCostInCoin =
                                                  coinPrice > 0
                                                    ? electricityCostForCoin /
                                                      coinPrice
                                                    : 0;

                                                // Рассчитываем чистую прибыль
                                                const profit =
                                                  totalDailyIncome -
                                                  electricityCostInCoin;
                                                const profitInUSDT =
                                                  incomeInUSDT -
                                                  electricityCostForCoin;

                                                return (
                                                  <p key={coin.name}>
                                                    {profit.toFixed(8)}{' '}
                                                    {coin.name} (
                                                    {profitInUSDT.toFixed(2)}{' '}
                                                    USDT)
                                                  </p>
                                                );
                                              },
                                            );
                                          })()}
                                          <div className='flex items-center gap-1'>
                                            <span>Выход в безубыток: </span>
                                            {(() => {
                                              if (!algorithm.coinTickers) {
                                                return (
                                                  <span className='text-danger'>
                                                    Нет данных
                                                  </span>
                                                );
                                              }

                                              // Рассчитываем общий доход в USDT
                                              const totalIncomeUSDT =
                                                algorithm.coinTickers.reduce(
                                                  (
                                                    total: number,
                                                    coin: any,
                                                  ) => {
                                                    const dailyIncome =
                                                      coin.pricePerHashrate *
                                                      equipment.hashrate;
                                                    const dailyIncomePerShare =
                                                      dailyIncome /
                                                      equipment.shareCount;
                                                    const totalDailyIncome =
                                                      dailyIncomePerShare *
                                                      userBalanceShareCount;
                                                    const coinPrice =
                                                      coinPrices[coin.name] ??
                                                      0;
                                                    return (
                                                      total +
                                                      totalDailyIncome *
                                                        coinPrice
                                                    );
                                                  },
                                                  0,
                                                );

                                              // Рассчитываем общие затраты на электроэнергию в USDT
                                              const powerPerShare =
                                                Number(equipment.power) /
                                                equipment.shareCount;
                                              const dailyPowerConsumption =
                                                powerPerShare *
                                                userBalanceShareCount *
                                                24;
                                              const totalElectricityCostUSDT =
                                                dailyPowerConsumption *
                                                Number(
                                                  electricityPrice?.pricePerKWh ??
                                                    0,
                                                );

                                              // Рассчитываем общую прибыль в USDT
                                              const totalProfitUSDT =
                                                totalIncomeUSDT -
                                                totalElectricityCostUSDT;

                                              // Разница между ценой покупки и продажи для всех долей пользователя
                                              const purchasePricePerShare =
                                                equipment.purchasePrice /
                                                equipment.shareCount;
                                              const salePricePerShare =
                                                equipment.salePrice /
                                                equipment.shareCount;
                                              const priceDifference =
                                                (purchasePricePerShare -
                                                  salePricePerShare) *
                                                userBalanceShareCount;

                                              if (totalProfitUSDT > 0) {
                                                return (
                                                  <>
                                                    {Math.ceil(
                                                      priceDifference /
                                                        totalProfitUSDT,
                                                    ).toLocaleString()}{' '}
                                                    дней
                                                    <Tooltip
                                                      content={
                                                        <div className='w-[200px] p-3 text-sm'>
                                                          <p>
                                                            Расчёт по текущему
                                                            курсу с учетом
                                                            разницы между ценой
                                                            покупки ($
                                                            {(
                                                              purchasePricePerShare *
                                                              userBalanceShareCount
                                                            ).toFixed(2)}
                                                            ) и ценой продажи ($
                                                            {(
                                                              salePricePerShare *
                                                              userBalanceShareCount
                                                            ).toFixed(2)}
                                                            ) ваших долей
                                                          </p>
                                                        </div>
                                                      }
                                                      placement='right'
                                                    >
                                                      <InformationCircleIcon className='h-5 w-5 cursor-help text-white' />
                                                    </Tooltip>
                                                  </>
                                                );
                                              } else {
                                                return (
                                                  <span className='text-danger'>
                                                    Не окупится
                                                  </span>
                                                );
                                              }
                                            })()}
                                          </div>
                                        </div>
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

      {isDepositModalOpen && user_id && (
        <DepositModal
          isOpen={isDepositModalOpen}
          onClose={async () => {
            setIsDepositModalOpen(false);
            await updateEquipmentData(user_id as string, 0);
          }}
          userId={Number(user_id)}
          userEmail={userEmail}
          coinTicker={selectedModalCoin}
        />
      )}

      {isWithdrawModalOpen && user_id && (
        <WithdrawModal
          isOpen={isWithdrawModalOpen}
          onSuccess={async () => {
            setIsWithdrawModalOpen(false);
            await updateEquipmentData(user_id as string, 0);
          }}
          onClose={async () => {
            setIsWithdrawModalOpen(false);
          }}
          userId={Number(user_id)}
          coinTicker={selectedModalCoin}
          userEmail={userEmail}
          balance={parseFloat(
            balances.find((b) => b.coinTicker === selectedModalCoin)
              ?.coinAmount || '0',
          )}
        />
      )}
    </section>
  );
}
