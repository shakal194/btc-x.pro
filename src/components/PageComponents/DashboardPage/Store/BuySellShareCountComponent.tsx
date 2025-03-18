'use client';
import { useState, useEffect, useTransition } from 'react';
import {
  Button,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalContent,
  ModalFooter,
  useDisclosure,
  Form,
} from '@heroui/react';
import { useSession } from 'next-auth/react';
import {
  fetchEquipmentById,
  insertTransactionsTable,
  fetchLastBalanceShareCountUserByEquipmentId,
} from '@/lib/data';
import Notiflix from 'notiflix';
import FullScreenSpinner from '@/components/ui/Spinner';

export default function BuySellShareCountComponent({
  equipmentId,
  equipmentUuid,
  updateEquipmentData,
}: {
  equipmentId: number;
  equipmentUuid: string;
  updateEquipmentData: (user_id: string, equipmentId: number) => void;
}) {
  const { data: session } = useSession();
  const user_id = session?.user?.id;

  const [isPending, startTransition] = useTransition();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState('');
  const [countShareBuySell, setCountShareBuySell] = useState<number>(0); // Количество долей
  const [balanceShareCount, setBalanceShareCount] = useState<number>(0); // Баланс долей
  const [pricePurchaseShare, setPricePurchaseShare] = useState<number>(0); // Цена за долю
  const [priceSalesShare, setPriceSalesShare] = useState<number>(0); // Цена за долю
  const [shareCount, setShareCount] = useState<number>(0); // Цена за долю

  const [isPurchase, setIsPurchase] = useState(true); // Логика для покупки/продажи
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      console.log('useEffect triggered', user_id, equipmentId);
      const currentBalance = async () => {
        try {
          const res = await fetchLastBalanceShareCountUserByEquipmentId(
            Number(user_id),
            equipmentId,
          );

          if (res && res.length > 0) {
            setBalanceShareCount(res[0].balanceShareCount);
          } else {
            setBalanceShareCount(0); // Если нет данных, устанавливаем 0
          }
        } catch (error) {
          console.error('Ошибка при получении баланса долей', error);
        }
      };
      currentBalance();
    }
  }, [isOpen, user_id, equipmentId]);

  // Получаем данные оборудования по ID
  useEffect(() => {
    const getEquipmentById = async () => {
      try {
        const res = await fetchEquipmentById(equipmentUuid); // Получаем данные устройства по id
        const data = res[0];
        if (data) {
          setName(data.name);
          setPricePurchaseShare(data.purchasePrice); // Установите цену за долю (например, цену покупки)
          setPriceSalesShare(data.salePrice); // Установите цену за долю (например, цену покупки)
          setShareCount(data.shareCount); // Установите цену за долю (например, цену покупки)
        }
      } catch (error) {
        console.error('Ошибка при получении данных оборудования', error);
      }
    };

    if (equipmentUuid) {
      getEquipmentById(); // Запрашиваем данные устройства, если id существует
    }
  }, [equipmentUuid]);

  // Функция для очистки инпутов при закрытии модального окна
  const handleCloseModal = () => {
    setError('');
    setCountShareBuySell(0);
    onClose();
  };

  const handleBuySellShares = async () => {
    if (!countShareBuySell || pricePurchaseShare <= 0) {
      setError('Пожалуйста, заполните все поля корректно');
      Notiflix.Notify.warning('Пожалуйста, заполните все поля корректно');
      return;
    }

    const updatedBalanceShareCount = isPurchase
      ? balanceShareCount + countShareBuySell // Покупка: увеличиваем
      : balanceShareCount - countShareBuySell; // Продажа: уменьшаем

    const updPricePerShare = isPurchase
      ? pricePurchaseShare / shareCount
      : priceSalesShare / shareCount;

    try {
      startTransition(async () => {
        setError(''); // Очистить ошибку

        // Вставка данных в таблицу транзакций
        await insertTransactionsTable({
          user_id: Number(user_id),
          equipment_id: equipmentId,
          countShareBuySell,
          balanceShareCount: updatedBalanceShareCount,
          pricePerShare: updPricePerShare,
          isPurchase,
        });

        if (user_id) {
          console.log('update userEquipment');
          updateEquipmentData(user_id, equipmentId);
        }
        // Очистить форму после успешного добавления
        handleCloseModal();

        Notiflix.Notify.success(isPurchase ? 'Доли куплены' : 'Доли проданы');
      });
    } catch (error) {
      console.error('Ошибка при покупке/продаже долей:', error);
      Notiflix.Notify.warning('Ошибка при покупке/продаже долей');
    }
  };

  return (
    <>
      <Button
        size='md'
        color='success'
        onPress={() => {
          setIsPurchase(true);
          onOpen();
        }}
      >
        Купить доли
      </Button>
      <Button
        size='md'
        color='danger'
        onPress={() => {
          setIsPurchase(false);
          onOpen();
        }}
      >
        Продать доли
      </Button>

      <Modal
        isOpen={isOpen}
        size='3xl'
        onClose={handleCloseModal}
        className='bg-slate-700'
      >
        <ModalContent>
          <ModalHeader className='flex flex-col gap-1 text-white'>
            {isPurchase ? `Купить доли ${name}` : `Продать доли ${name}`}
          </ModalHeader>

          <ModalBody className='mx-auto'>
            <Form>
              <Input
                size='lg'
                label='Название оборудования'
                labelPlacement='inside'
                placeholder='Название'
                isRequired
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='w-[400px]'
                disabled
              />
              <Input
                size='lg'
                label='Количество долей'
                labelPlacement='inside'
                placeholder='Количество долей'
                type='number'
                isRequired
                value={countShareBuySell.toString()}
                onChange={(e) => setCountShareBuySell(parseInt(e.target.value))}
                className='w-[400px]'
              />
              <Input
                size='lg'
                label='Баланс долей'
                labelPlacement='inside'
                placeholder='Баланс долей'
                type='number'
                isDisabled
                value={balanceShareCount.toString()}
                onChange={(e) => setBalanceShareCount(parseInt(e.target.value))}
                className='w-[400px]'
              />
              <Input
                size='lg'
                label='Цена за долю'
                labelPlacement='inside'
                placeholder='Цена за долю'
                type='number'
                isRequired
                value={
                  isPurchase
                    ? (pricePurchaseShare / shareCount).toString()
                    : (priceSalesShare / shareCount).toString()
                }
                onChange={(e) =>
                  isPurchase
                    ? setPricePurchaseShare(parseFloat(e.target.value))
                    : setPriceSalesShare(parseFloat(e.target.value))
                }
                className='w-[400px]'
              />
              {error && <div className='mt-4 text-red-500'>{error}</div>}
            </Form>
          </ModalBody>

          <ModalFooter>
            <p className='text-white'>purchase {isPurchase}</p>
            <Button color='danger' onPress={handleCloseModal}>
              Отменить
            </Button>
            <Button color='success' onPress={handleBuySellShares}>
              {isPurchase ? 'Купить' : 'Продать'}
            </Button>
            {isPending && <FullScreenSpinner />}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
