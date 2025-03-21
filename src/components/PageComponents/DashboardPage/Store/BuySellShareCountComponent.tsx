'use client';
import { useState, useEffect } from 'react';
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
  fetchUSDTBalance,
  updateUSDTBalance,
} from '@/lib/data';
import Notiflix from 'notiflix';
import FullScreenSpinner from '@/components/ui/Spinner';

interface BuySellShareCountComponentProps {
  equipmentId: number;
  equipmentUuid: string | null;
  updateEquipmentData: (user_id: string, equipmentId: number) => Promise<void>;
}

export default function BuySellShareCountComponent({
  equipmentId,
  equipmentUuid,
  updateEquipmentData,
}: BuySellShareCountComponentProps) {
  const { data: session } = useSession();
  const user_id = session?.user?.id;
  const [isLoading, setIsLoading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [equipmentName, setEquipmentName] = useState('');
  const [shareCountInput, setShareCountInput] = useState<string>('');
  const [userShareBalance, setUserShareBalance] = useState<number>(0);
  const [sharePurchasePrice, setSharePurchasePrice] = useState<number>(0);
  const [shareSalePrice, setShareSalePrice] = useState<number>(0);
  const [totalShareCount, setTotalShareCount] = useState<number>(0);
  const [usdtBalance, setUsdtBalance] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [isPurchase, setIsPurchase] = useState(true);
  const [transactionError, setTransactionError] = useState('');
  const [shareCountError, setShareCountError] = useState('');

  useEffect(() => {
    if (isOpen) {
      const currentBalance = async () => {
        try {
          const balanceShareCount =
            await fetchLastBalanceShareCountUserByEquipmentId(
              Number(user_id),
              equipmentId,
            );
          setUserShareBalance(balanceShareCount ?? 0);
        } catch (error) {
          console.error('Ошибка при получении баланса долей', error);
          setUserShareBalance(0);
        }
      };
      currentBalance();
    }
  }, [isOpen, user_id, equipmentId]);

  // Получаем данные оборудования по ID
  useEffect(() => {
    const getEquipmentById = async () => {
      try {
        if (!equipmentUuid) return;
        const res = await fetchEquipmentById(equipmentUuid);
        const data = res[0];
        if (data) {
          setEquipmentName(data.name);
          setSharePurchasePrice(data.purchasePrice);
          setShareSalePrice(data.salePrice);
          setTotalShareCount(data.shareCount);
        }
      } catch (error) {
        console.error('Ошибка при получении данных оборудования', error);
      }
    };

    if (equipmentUuid) {
      getEquipmentById();
    }
  }, [equipmentUuid]);

  // Получаем баланс USDT при открытии модального окна
  useEffect(() => {
    if (isOpen && user_id) {
      const fetchBalance = async () => {
        try {
          const balance = await fetchUSDTBalance(Number(user_id));
          setUsdtBalance(Number(balance) || 0);
        } catch (error) {
          console.error('Ошибка при получении баланса USDT:', error);
          setUsdtBalance(0);
        }
      };
      fetchBalance();
    }
  }, [isOpen, user_id]);

  // Рассчитываем общую сумму при изменении количества долей
  useEffect(() => {
    const shareCount = Number(shareCountInput) || 0;
    if (isPurchase) {
      const total = shareCount * (sharePurchasePrice / totalShareCount);
      setTotalAmount(total);
    } else {
      const total = shareCount * (shareSalePrice / totalShareCount);
      setTotalAmount(total);
    }
  }, [
    shareCountInput,
    sharePurchasePrice,
    shareSalePrice,
    totalShareCount,
    isPurchase,
  ]);

  // Функция для очистки инпутов при закрытии модального окна
  const handleCloseModal = () => {
    setTransactionError('');
    setShareCountInput('');
    setShareCountError('');
    onClose();
  };

  // Обработчик изменения количества долей
  const handleShareCountChange = (value: string) => {
    setShareCountInput(value);
    setTransactionError('');
    setShareCountError('');

    const numValue = Number(value);

    if (isNaN(numValue) || numValue <= 0) {
      setShareCountError('Количество долей должно быть положительным числом');
      return;
    }

    if (!isPurchase && numValue > userShareBalance) {
      setShareCountError(`У вас только ${userShareBalance} долей для продажи`);
      return;
    }

    if (isPurchase) {
      const total = numValue * (sharePurchasePrice / totalShareCount);
      if (total > usdtBalance) {
        setShareCountError(
          `Необходимо пополнить баланс на ${(total - usdtBalance).toFixed(2)} USDT`,
        );
        return;
      }
    }
  };

  const handleBuySellShares = async () => {
    if (!user_id || !equipmentUuid) return;

    setIsLoading(true);
    try {
      await fetch('/api/buy-share-count', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: Number(user_id),
          equipment_uuid: equipmentUuid,
        }),
      });

      const shareCount = Number(shareCountInput) || 0;
      if (!shareCount || sharePurchasePrice <= 0) {
        setTransactionError('Пожалуйста, заполните все поля корректно');
        Notiflix.Notify.warning('Пожалуйста, заполните все поля корректно');
        return;
      }

      const updatedShareBalance = isPurchase
        ? userShareBalance + shareCount
        : userShareBalance - shareCount;

      if (!isPurchase && updatedShareBalance < 0) {
        setTransactionError('Недостаточно долей для продажи');
        Notiflix.Notify.warning('Недостаточно долей для продажи');
        return;
      }

      const pricePerShare = isPurchase
        ? sharePurchasePrice / totalShareCount
        : shareSalePrice / totalShareCount;

      const totalAmount = shareCount * pricePerShare;

      await updateUSDTBalance(Number(user_id), totalAmount, isPurchase);

      await insertTransactionsTable({
        user_id: Number(user_id),
        equipment_id: equipmentId,
        countShareBuySell: shareCount,
        balanceShareCount: updatedShareBalance,
        pricePerShare: pricePerShare,
        isPurchase,
      });

      if (user_id) {
        await updateEquipmentData(user_id.toString(), equipmentId);
      }

      handleCloseModal();
      Notiflix.Notify.success(isPurchase ? 'Доли куплены' : 'Доли проданы');
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Ошибка при покупке/продаже долей';
      console.error('Ошибка при покупке/продаже долей:', error);
      setTransactionError(errorMessage);
      Notiflix.Notify.failure(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        size='md'
        color='success'
        onPress={() => {
          setIsPurchase(true);
          setTransactionError('');
          setShareCountError('');
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
          setTransactionError('');
          setShareCountError('');
          onOpen();
        }}
      >
        Продать доли
      </Button>

      <Modal
        isOpen={isOpen}
        size='xl'
        placement='center'
        scrollBehavior='outside'
        onClose={handleCloseModal}
        className='bg-slate-700'
      >
        <ModalContent>
          <ModalHeader className='flex flex-col gap-1 text-white'>
            {isPurchase
              ? `Купить доли ${equipmentName}`
              : `Продать доли ${equipmentName}`}
          </ModalHeader>

          <ModalBody className='mx-auto'>
            <Form>
              <Input
                size='sm'
                label='Название оборудования'
                labelPlacement='inside'
                placeholder='Название'
                isRequired
                value={equipmentName}
                onChange={(e) => setEquipmentName(e.target.value)}
                className='w-full sm:w-[350px] md:w-[400px]'
                disabled
              />
              <Input
                size='sm'
                label='Количество долей'
                labelPlacement='inside'
                placeholder='Количество долей'
                type='number'
                min={0}
                isRequired
                value={shareCountInput}
                onChange={(e) => handleShareCountChange(e.target.value)}
                className='w-full sm:w-[350px] md:w-[400px]'
                isInvalid={!!shareCountError}
                errorMessage={shareCountError}
              />
              <Input
                size='sm'
                label='Баланс долей'
                labelPlacement='inside'
                placeholder='Баланс долей'
                type='number'
                isDisabled
                value={userShareBalance > 0 ? userShareBalance.toString() : ''}
                className='w-full sm:w-[350px] md:w-[400px]'
              />
              <Input
                size='sm'
                label='Цена за долю'
                labelPlacement='inside'
                placeholder='Цена за долю'
                type='number'
                isRequired
                isDisabled
                value={
                  isPurchase
                    ? (sharePurchasePrice / totalShareCount || 0).toString()
                    : (shareSalePrice / totalShareCount || 0).toString()
                }
                className='w-full sm:w-[350px] md:w-[400px]'
              />
              {isPurchase && (
                <>
                  <Input
                    size='sm'
                    label='Баланс USDT'
                    labelPlacement='inside'
                    type='number'
                    isDisabled
                    value={usdtBalance.toFixed(2)}
                    className='w-full sm:w-[350px] md:w-[400px]'
                  />
                  <Input
                    size='sm'
                    label='Итого к оплате'
                    labelPlacement='inside'
                    type='number'
                    isDisabled
                    value={totalAmount.toFixed(2)}
                    className={`w-full sm:w-[350px] md:w-[400px] ${
                      totalAmount > usdtBalance
                        ? 'text-red-500'
                        : 'text-green-500'
                    }`}
                  />
                </>
              )}
              {transactionError && (
                <div className='mt-4 text-red-500'>{transactionError}</div>
              )}
            </Form>
          </ModalBody>

          <ModalFooter className='flex flex-col gap-2 sm:flex-row'>
            <Button color='danger' onPress={handleCloseModal}>
              Отменить
            </Button>
            <Button
              color='success'
              onPress={handleBuySellShares}
              isDisabled={
                !!shareCountError || (isPurchase && totalAmount > usdtBalance)
              }
            >
              {isPurchase ? 'Купить' : 'Продать'}
            </Button>
            {isLoading && <FullScreenSpinner />}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
