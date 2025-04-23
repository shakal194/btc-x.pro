'use client';
import { useState, useEffect } from 'react';
import {
  fetchEquipments,
  fetchAlgorithms,
  fetchAllUserBalanceShares,
  fetchElectricityPrice,
  fetchCoinPrice,
} from '@/lib/data';
import Image from 'next/image';
import BuyShareCountComponent from '@/components/PageComponents/DashboardPage/Store/BuyShareCountComponent';
import { Tabs, Tab, divider } from '@heroui/react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { Tooltip } from '@heroui/react';
import { StoreSkeleton } from '@/components/ui/Skeletons';

export default function Store() {
  const [isLoading, setIsLoading] = useState<boolean>(false); // Флаг загрузки
  const [algorithms, setAlgorithms] = useState<any[]>([]); // Состояние для хранения алгоритмов
  const [equipmentsFetch, setEquipmentsFetch] = useState<any[]>([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('');
  const [miningRevenue, setMiningRevenue] = useState<{
    [key: string]: { btc_revenue: string; btc_revenue24: string };
  }>({});
  const [electricityPrice, setElectricityPrice] = useState<number>(0);
  const [coinPrices, setCoinPrices] = useState<{ [key: string]: number }>({});

  // Функция для обновления данных оборудования
  const updateEquipmentData = async (user_id: string, equipmentId: number) => {
    // Эта функция теперь просто проверяет баланс, но не сохраняет его в состояние
    const userBalanceShares = await fetchAllUserBalanceShares(Number(user_id));
    return userBalanceShares[equipmentId]?.balanceShareCount || 0;
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
        if (data.length > 0) {
          setSelectedAlgorithm(data[0].name);
        }
      } catch (error) {
        console.error('Ошибка при получении алгоритмов', error);
      }
    };

    getAlgorithms();
  }, []);

  // Получаем цену электричества
  useEffect(() => {
    const getElectricityPrice = async () => {
      try {
        const price = await fetchElectricityPrice();
        setElectricityPrice(Number(price?.pricePerKWh) || 0);
      } catch (error) {
        console.error('Error fetching electricity price:', error);
      }
    };
    getElectricityPrice();
  }, []);

  // Рассчитываем доход для каждого устройства
  useEffect(() => {
    const calculateRevenue = async () => {
      const newMiningRevenue: {
        [key: string]: { btc_revenue: string; btc_revenue24: string };
      } = {};

      for (const equipment of equipmentsFetch) {
        if (equipment.algorithm) {
          try {
            const dailyIncome = equipment.power * electricityPrice;
            newMiningRevenue[equipment.uuid] = {
              btc_revenue: dailyIncome.toFixed(8),
              btc_revenue24: dailyIncome.toFixed(8),
            };
          } catch (error) {
            console.error(
              `Error calculating revenue for ${equipment.name}:`,
              error,
            );
          }
        }
      }

      setMiningRevenue(newMiningRevenue);
    };

    if (equipmentsFetch.length > 0 && electricityPrice > 0) {
      calculateRevenue();
    }
  }, [equipmentsFetch, electricityPrice]);

  useEffect(() => {
    const getCoinPrices = async () => {
      try {
        const newCoinPrices: { [key: string]: number } = {};
        for (const algorithm of algorithms) {
          if (algorithm.coinTickers) {
            for (const coin of algorithm.coinTickers) {
              const price = await fetchCoinPrice(coin.name);
              newCoinPrices[coin.name] = price;
            }
          }
        }
        setCoinPrices(newCoinPrices);
      } catch (error) {
        console.error('Error fetching coin prices:', error);
      }
    };

    if (algorithms.length > 0) {
      getCoinPrices();
    }
  }, [algorithms]);

  return (
    <section className='space-y-4'>
      <div className='text-lg text-white'>
        <Tabs
          selectedKey={selectedAlgorithm}
          variant='underlined'
          color='warning'
          onSelectionChange={(key) => setSelectedAlgorithm(String(key))}
          className='gap-2'
        >
          {algorithms.map((algorithm) => (
            <Tab key={algorithm.name} title={algorithm.name}>
              <ul className='space-y-4'>
                {isLoading ? (
                  <p>Загрузка оборудования...</p>
                ) : (
                  equipmentsFetch
                    .filter(
                      (equipment) => equipment.algorithm_id === algorithm.id,
                    )
                    .map((equipment, index) => {
                      const algorithmCoinTickers = algorithm?.coinTickers || [];
                      const coinPrice =
                        algorithmCoinTickers[0]?.pricePerHashrate || 0;
                      const dailyIncome = coinPrice * equipment.hashrate;

                      // Проверяем, загружены ли все необходимые данные
                      const isDataLoaded =
                        equipment.power &&
                        electricityPrice > 0 &&
                        Object.keys(coinPrices).length > 0;

                      if (!isDataLoaded) {
                        return <StoreSkeleton key={index} />;
                      }

                      return (
                        <li
                          key={index}
                          className='border-b-1 border-secondary p-2'
                        >
                          <div className='flex flex-col items-center gap-4 md:flex-row'>
                            <div className='mr-4'>
                              <p className='text-center'>
                                <b>
                                  {equipment.name} {equipment.hashrate}
                                  {equipment.hashrate_unit}
                                </b>
                              </p>
                              {equipment.photoUrl && (
                                <Image
                                  src={equipment.photoUrl}
                                  alt={equipment.name}
                                  width={450}
                                  height={450}
                                  className='h-[350px] w-[350px] rounded-lg md:h-[450px] md:w-[450px]'
                                  priority
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
                                  <b>Доход в сутки одного устройства:</b>{' '}
                                </p>
                                {algorithm.coinTickers &&
                                  algorithm.coinTickers.map((coin: any) => (
                                    <p key={coin.name}>
                                      {(
                                        coin.pricePerHashrate *
                                        equipment.hashrate
                                      ).toFixed(8)}{' '}
                                      {coin.name}
                                    </p>
                                  ))}
                                <p>
                                  <b>Прибыль в сутки всех долей:</b>
                                </p>
                                {algorithm.coinTickers && (
                                  <div className='flex flex-col gap-2'>
                                    {algorithm.coinTickers.map((coin: any) => {
                                      // Рассчитываем доход для всей мощности устройства
                                      const dailyIncome =
                                        coin.pricePerHashrate *
                                        equipment.hashrate;

                                      // Рассчитываем доход на одну долю
                                      const dailyIncomePerShare =
                                        dailyIncome / equipment.shareCount;

                                      // Рассчитываем затраты на электроэнергию для одной доли
                                      const powerPerShare =
                                        Number(equipment.power) /
                                        equipment.shareCount;
                                      const dailyPowerConsumption =
                                        powerPerShare * 24;
                                      const dailyElectricityCostUSD =
                                        dailyPowerConsumption *
                                        electricityPrice;

                                      // Конвертируем затраты в монету
                                      const currentCoinPrice =
                                        coinPrices[coin.name] ?? 0;
                                      const dailyElectricityCostInCoin =
                                        currentCoinPrice > 0
                                          ? dailyElectricityCostUSD /
                                            currentCoinPrice
                                          : 0;

                                      // Рассчитываем прибыль для одной доли
                                      const profitPerShare =
                                        dailyIncomePerShare -
                                        dailyElectricityCostInCoin;

                                      // Рассчитываем общую прибыль для всех долей
                                      const totalProfit =
                                        profitPerShare * equipment.shareCount;

                                      // Рассчитываем доход в USDT
                                      const incomeInUSDT =
                                        dailyIncome * currentCoinPrice;

                                      return (
                                        <div
                                          key={coin.name}
                                          className='flex flex-col gap-1'
                                        >
                                          <p>
                                            {dailyIncome.toFixed(8)} {coin.name}{' '}
                                            ({incomeInUSDT.toFixed(2)} USDT)
                                          </p>
                                          <p>
                                            Прибыль: {totalProfit.toFixed(8)}{' '}
                                            {coin.name} (
                                            {(
                                              totalProfit * currentCoinPrice
                                            ).toFixed(2)}{' '}
                                            USDT)
                                          </p>
                                        </div>
                                      );
                                    })}
                                    <div className='flex items-center gap-1'>
                                      <span>Окупаемость: </span>
                                      {(() => {
                                        // Рассчитываем общую прибыль по всем монетам
                                        const totalDailyProfit =
                                          algorithm.coinTickers.reduce(
                                            (total: number, coin: any) => {
                                              // Рассчитываем доход для всей мощности устройства
                                              const dailyIncome =
                                                coin.pricePerHashrate *
                                                equipment.hashrate;

                                              // Рассчитываем доход на одну долю
                                              const dailyIncomePerShare =
                                                dailyIncome /
                                                equipment.shareCount;

                                              // Рассчитываем затраты на электроэнергию для одной доли
                                              const powerPerShare =
                                                Number(equipment.power) /
                                                equipment.shareCount;
                                              const dailyPowerConsumption =
                                                powerPerShare * 24;
                                              const dailyElectricityCostUSD =
                                                dailyPowerConsumption *
                                                electricityPrice;

                                              // Конвертируем затраты в монету
                                              const currentCoinPrice =
                                                coinPrices[coin.name] ?? 0;
                                              const dailyElectricityCostInCoin =
                                                currentCoinPrice > 0
                                                  ? dailyElectricityCostUSD /
                                                    currentCoinPrice
                                                  : 0;

                                              // Рассчитываем прибыль для одной доли
                                              const profitPerShare =
                                                dailyIncomePerShare -
                                                dailyElectricityCostInCoin;

                                              // Рассчитываем общую прибыль для всех долей
                                              const totalProfit =
                                                profitPerShare *
                                                equipment.shareCount;

                                              // Конвертируем прибыль в USDT для общего расчета
                                              const profitInUSDT =
                                                totalProfit * currentCoinPrice;

                                              return total + profitInUSDT;
                                            },
                                            0,
                                          );

                                        if (totalDailyProfit > 0) {
                                          return (
                                            <>
                                              {Math.ceil(
                                                Number(
                                                  equipment.purchasePrice,
                                                ) / totalDailyProfit,
                                              ).toLocaleString()}{' '}
                                              дней
                                              <Tooltip
                                                content={
                                                  <div className='w-[200px] p-3 text-sm'>
                                                    <p>
                                                      Расчёт по текущему курсу
                                                      всех криптовалют, которые
                                                      добываются, без учёта
                                                      остаточной стоимости
                                                      оборудования
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
                                <BuyShareCountComponent
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
                )}
                {!isLoading &&
                  equipmentsFetch.filter(
                    (equipment) => equipment.algorithm_id === algorithm.id,
                  ).length === 0 && (
                    <p>Нет доступного оборудования для этого алгоритма</p>
                  )}
              </ul>
            </Tab>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
