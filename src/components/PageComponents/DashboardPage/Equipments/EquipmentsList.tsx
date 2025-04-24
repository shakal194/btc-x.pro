'use client';
import { useState, useEffect } from 'react';
import {
  fetchEquipments,
  fetchAlgorithms,
  hasPurchasedShares,
  getEquipmentSharesInfo,
} from '@/lib/data';
import Image from 'next/image';
import AddEquipmentModal from '@/components/PageComponents/DashboardPage/Equipments/AddEquipmentModal';
import EditEquipmentModal from '@/components/PageComponents/DashboardPage/Equipments/EditEquipmentModal';
import DeleteEquipmentModal from './DeleteEquipmentModal';
import FullScreenSpinner from '@/components/ui/Spinner';

export default function EquipmentsList() {
  const [isLoading, setIsLoading] = useState<boolean>(true); // Изменили начальное значение на true
  const [isLoadingShares, setIsLoadingShares] = useState<boolean>(false);
  const [algorithms, setAlgorithms] = useState<any[]>([]); // Состояние для хранения алгоритмов
  const [equipmentsFetch, setEquipmentsFetch] = useState<any[]>([]);
  const [equipmentShares, setEquipmentShares] = useState<
    Record<number, boolean>
  >({});
  const [equipmentSharesInfo, setEquipmentSharesInfo] = useState<
    Record<number, { totalPurchasedShares: number; activeDevices: number }>
  >({});

  //Получаем список всего оборудования
  const getEquipments = async () => {
    setIsLoading(true);
    try {
      const data = await fetchEquipments();
      setEquipmentsFetch(data);

      // Проверяем наличие купленных долей для каждого оборудования
      const sharesInfo: Record<number, boolean> = {};
      for (const equipment of data) {
        const hasShares = await hasPurchasedShares(equipment.id);
        sharesInfo[equipment.id] = hasShares;
      }
      setEquipmentShares(sharesInfo);

      return data;
    } catch (error) {
      console.error('Ошибка при получении данных по оборудованию', error);
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

  useEffect(() => {
    const fetchSharesInfo = async () => {
      setIsLoadingShares(true);
      try {
        const info: Record<
          number,
          { totalPurchasedShares: number; activeDevices: number }
        > = {};
        for (const equipment of equipmentsFetch) {
          const sharesInfo = await getEquipmentSharesInfo(equipment.id);
          info[equipment.id] = sharesInfo;
        }
        setEquipmentSharesInfo(info);
      } catch (error) {
        console.error('Error fetching shares info:', error);
      } finally {
        setIsLoadingShares(false);
      }
    };

    if (equipmentsFetch.length > 0) {
      fetchSharesInfo();
    }
  }, [equipmentsFetch]);

  return (
    <>
      {(isLoading || isLoadingShares) && <FullScreenSpinner />}
      <section className='space-y-4 p-4'>
        <div className='sticky top-0 z-10 flex justify-end'>
          <AddEquipmentModal onEquipmentAdded={getEquipments} />
        </div>
        <div className='p-2 text-lg text-white'>
          <ul className='space-y-4'>
            {equipmentsFetch.length > 0 ? (
              equipmentsFetch.map((equipment, index) => {
                // Находим алгоритм по ID
                const algorithm = algorithms.find(
                  (algo) => algo.id === equipment.algorithm_id,
                );

                //const algorithmCoinTickers = algorithm?.coinTickers || [];
                //const coinPrice = algorithmCoinTickers[0]?.pricePerHashrate || 0;
                //const dailyIncome = coinPrice * equipment.hashrate;

                return (
                  <li key={index} className='border-b-1 border-secondary p-4'>
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
                            src={equipment.photoUrl}
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
                            <b>Всего куплено долей:</b>{' '}
                            {equipmentSharesInfo[equipment.id]
                              ?.totalPurchasedShares ?? 0}
                          </p>
                          <p>
                            <b>Долей в работе:</b>{' '}
                            {equipmentSharesInfo[equipment.id]
                              ?.totalPurchasedShares
                              ? equipmentSharesInfo[equipment.id]
                                  .totalPurchasedShares % equipment.shareCount
                              : 0}
                          </p>
                          <p>
                            <b>Устройств в работе:</b>{' '}
                            {isLoadingShares ? (
                              <span className='ml-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
                            ) : equipmentSharesInfo[equipment.id]
                                ?.totalPurchasedShares ? (
                              Math.floor(
                                equipmentSharesInfo[equipment.id]
                                  .totalPurchasedShares / equipment.shareCount,
                              )
                            ) : (
                              0
                            )}
                          </p>
                          <p>
                            <b>Доход в сутки одного устройства:</b>
                          </p>
                          {algorithm?.coinTickers &&
                            algorithm.coinTickers.map((coin: any) => (
                              <p key={coin.name}>
                                {(
                                  coin.pricePerHashrate * equipment.hashrate
                                ).toFixed(8)}{' '}
                                {coin.name}
                              </p>
                            ))}
                        </div>
                        <div className='mt-4 flex justify-between gap-2'>
                          <EditEquipmentModal
                            onEquipmentUpd={getEquipments}
                            uuid={equipment.uuid}
                          />
                          <DeleteEquipmentModal
                            equipmentName={equipment.name}
                            equipmentId={equipment.id}
                            onEquipmentDeleted={getEquipments}
                            isDisabled={equipmentShares[equipment.id]}
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
    </>
  );
}
