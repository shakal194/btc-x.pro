'use client';
import { useState, useEffect, useCallback } from 'react';
import {
  fetchEquipments,
  fetchAlgorithms,
  fetchAllUserBalanceShares,
  fetchElectricityPrice,
  fetchCoinPrice,
} from '@/lib/data';
import Image from 'next/image';
import BuyShareCountComponent from '@/components/PageComponents/DashboardPage/Store/BuyShareCountComponent';
import { Tabs, Tab } from '@heroui/react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { Tooltip } from '@heroui/react';
import { StoreSkeleton } from '@/components/ui/Skeletons';
import { useTranslations } from 'next-intl';

export default function Store() {
  const t = useTranslations('cloudMiningPage.dashboard.userContent');
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
  const getEquipments = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchEquipments();
      setEquipmentsFetch(data);
      return data;
    } catch (error) {
      console.error(t('error_fetching_equipments'), error);
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    getEquipments();
  }, [getEquipments]);

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
        console.error(t('error_fetching_algorithms'), error);
      }
    };

    getAlgorithms();
  }, [t]);

  // Получаем цену электричества
  useEffect(() => {
    const getElectricityPrice = async () => {
      try {
        const price = await fetchElectricityPrice();
        setElectricityPrice(Number(price?.pricePerKWh) || 0);
      } catch (error) {
        console.error(t('error_fetching_electricity_price'), error);
      }
    };
    getElectricityPrice();
  }, [t]);

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
              t('error_calculating_revenue_for_equipment', {
                equipmentName: equipment.name,
              }),
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
  }, [equipmentsFetch, electricityPrice, t]);

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
        console.error(t('error_fetching_coin_prices'), error);
      }
    };

    if (algorithms.length > 0) {
      getCoinPrices();
    }
  }, [algorithms, t]);

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
                  <p>{t('loading_equipment')}</p>
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
                                  <b>{t('algorithm')}:</b> {algorithm.name}
                                </p>
                                <p>
                                  <b>{t('power')}:</b> {equipment.power} кВт
                                </p>
                                <p>
                                  <b>{t('shares')}:</b> {equipment.shareCount}
                                </p>
                                <p>
                                  <b>{t('buingPrice')}:</b> $
                                  {equipment.purchasePrice}
                                </p>
                                <p>
                                  <b>{t('sharePrice')}:</b> $
                                  {equipment.purchasePrice /
                                    equipment.shareCount}
                                </p>
                                <p>
                                  <b>{t('dailyIncomePerDevice')}:</b>{' '}
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
                                  <b>{t('dailyProfitPerDevice')}:</b>
                                </p>
                                {algorithm.coinTickers && (
                                  <div className='flex flex-col gap-2'>
                                    {(() => {
                                      // Рассчитываем общий доход в USDT
                                      const totalIncomeUSDT =
                                        algorithm.coinTickers.reduce(
                                          (total: number, coin: any) => {
                                            const dailyIncome =
                                              coin.pricePerHashrate *
                                              equipment.hashrate;
                                            const currentCoinPrice =
                                              coinPrices[coin.name] ?? 0;
                                            return (
                                              total +
                                              dailyIncome * currentCoinPrice
                                            );
                                          },
                                          0,
                                        );

                                      // Рассчитываем общие затраты на электроэнергию в USDT
                                      const dailyPowerConsumption =
                                        Number(equipment.power) * 24;
                                      const totalElectricityCostUSDT =
                                        dailyPowerConsumption *
                                        electricityPrice;

                                      return algorithm.coinTickers.map(
                                        (coin: any) => {
                                          // Рассчитываем доход для всей мощности устройства
                                          const dailyIncome =
                                            coin.pricePerHashrate *
                                            equipment.hashrate;
                                          const currentCoinPrice =
                                            coinPrices[coin.name] ?? 0;
                                          const incomeInUSDT =
                                            dailyIncome * currentCoinPrice;

                                          // Рассчитываем долю этой монеты в общем доходе
                                          const incomeShare =
                                            totalIncomeUSDT > 0
                                              ? incomeInUSDT / totalIncomeUSDT
                                              : 0;

                                          // Распределяем затраты на электричество пропорционально доходу
                                          const electricityCostForCoin =
                                            totalElectricityCostUSDT *
                                            incomeShare;

                                          // Конвертируем затраты в монету
                                          const electricityCostInCoin =
                                            currentCoinPrice > 0
                                              ? electricityCostForCoin /
                                                currentCoinPrice
                                              : 0;

                                          // Рассчитываем чистую прибыль
                                          const profit =
                                            dailyIncome - electricityCostInCoin;
                                          const profitInUSDT =
                                            profit * currentCoinPrice;

                                          return (
                                            <div
                                              key={coin.name}
                                              className='flex flex-col gap-1'
                                            >
                                              <p>
                                                {profit.toFixed(8)} {coin.name}{' '}
                                                ({profitInUSDT.toFixed(2)} USDT)
                                              </p>
                                            </div>
                                          );
                                        },
                                      );
                                    })()}
                                    <div className='flex items-center gap-1'>
                                      <span>{t('payback')}: </span>
                                      {(() => {
                                        // Рассчитываем общий доход в USDT
                                        const totalIncomeUSDT =
                                          algorithm.coinTickers.reduce(
                                            (total: number, coin: any) => {
                                              const dailyIncome =
                                                coin.pricePerHashrate *
                                                equipment.hashrate;
                                              const currentCoinPrice =
                                                coinPrices[coin.name] ?? 0;
                                              return (
                                                total +
                                                dailyIncome * currentCoinPrice
                                              );
                                            },
                                            0,
                                          );

                                        // Рассчитываем общие затраты на электроэнергию в USDT
                                        const dailyPowerConsumption =
                                          Number(equipment.power) * 24;
                                        const totalElectricityCostUSDT =
                                          dailyPowerConsumption *
                                          electricityPrice;

                                        // Рассчитываем общую прибыль в USDT
                                        const totalProfitUSDT =
                                          totalIncomeUSDT -
                                          totalElectricityCostUSDT;

                                        if (totalProfitUSDT > 0) {
                                          return (
                                            <>
                                              {Math.ceil(
                                                Number(
                                                  equipment.purchasePrice,
                                                ) / totalProfitUSDT,
                                              ).toLocaleString()}{' '}
                                              {t('days')}
                                              <Tooltip
                                                content={
                                                  <div className='w-[200px] p-3 text-sm'>
                                                    <p>
                                                      {t('breakeven_text_4')}
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
                                              {t('not_payback')}
                                            </span>
                                          );
                                        }
                                      })()}
                                    </div>
                                    <div className='flex items-center gap-1'>
                                      <span>{t('breakeven')}: </span>
                                      {(() => {
                                        // Рассчитываем общий доход в USDT
                                        const totalIncomeUSDT =
                                          algorithm.coinTickers.reduce(
                                            (total: number, coin: any) => {
                                              const dailyIncome =
                                                coin.pricePerHashrate *
                                                equipment.hashrate;
                                              const currentCoinPrice =
                                                coinPrices[coin.name] ?? 0;
                                              return (
                                                total +
                                                dailyIncome * currentCoinPrice
                                              );
                                            },
                                            0,
                                          );

                                        // Рассчитываем общие затраты на электроэнергию в USDT
                                        const dailyPowerConsumption =
                                          Number(equipment.power) * 24;
                                        const totalElectricityCostUSDT =
                                          dailyPowerConsumption *
                                          electricityPrice;

                                        // Рассчитываем общую прибыль в USDT
                                        const totalProfitUSDT =
                                          totalIncomeUSDT -
                                          totalElectricityCostUSDT;

                                        // Разница между ценой покупки и продажи
                                        const priceDifference =
                                          equipment.purchasePrice -
                                          equipment.salePrice;

                                        if (totalProfitUSDT > 0) {
                                          return (
                                            <>
                                              {Math.ceil(
                                                priceDifference /
                                                  totalProfitUSDT,
                                              ).toLocaleString()}{' '}
                                              {t('days')}
                                              <Tooltip
                                                content={
                                                  <div className='w-[200px] p-3 text-sm'>
                                                    <p>
                                                      {t('breakeven_text')} ($
                                                      {equipment.purchasePrice})
                                                      {t('breakeven_text_2')} ($
                                                      {equipment.salePrice})
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
                  ).length === 0 && <p>{t('no_available_equipment')}</p>}
              </ul>
            </Tab>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
