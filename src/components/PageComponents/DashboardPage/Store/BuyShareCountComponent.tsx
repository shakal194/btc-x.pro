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
  insertTransactionsTable,
  updateUSDTBalance,
  fetchReferralBonus,
  updateReferralBonus,
  insertReferralBonusTransaction,
  fetchEquipmentByUuid,
  ensureBalanceRecordExists,
  fetchUSDTBalance,
  fetchAllUserBalanceShares,
} from '@/lib/data';
import Notiflix from 'notiflix';
import { createDepositForCoin } from '@/lib/balance';
import { FullScreenSpinner } from '@/components/FullScreenSpinner';

interface BuyShareCountComponentProps {
  equipmentId: number;
  equipmentUuid: string | null;
  updateEquipmentData: (userId: string, equipmentId: number) => Promise<number>;
}

export default function BuyShareCountComponent({
  equipmentId,
  equipmentUuid,
  updateEquipmentData,
}: BuyShareCountComponentProps) {
  const { data: session } = useSession();
  const user_id = session?.user?.id;
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [shareCountInput, setShareCountInput] = useState<string>('');
  const [sharePurchasePrice, setSharePurchasePrice] = useState<number>(0);
  const [totalShareCount, setTotalShareCount] = useState<number>(0);
  const [usdtBalance, setUsdtBalance] = useState<number>(0);
  const [userShareBalance, setUserShareBalance] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [transactionError, setTransactionError] = useState('');
  const [shareCountError, setShareCountError] = useState('');
  const [equipmentName, setEquipmentName] = useState<string>('');

  // Получаем данные оборудования по ID
  useEffect(() => {
    const getEquipmentById = async () => {
      try {
        if (!equipmentUuid) return;
        const res = await fetchEquipmentByUuid(equipmentUuid);
        const data = res[0];
        if (data) {
          setSharePurchasePrice(data.purchasePrice);
          setTotalShareCount(data.shareCount);
          setEquipmentName(data.name || '');
        }
      } catch (error) {
        console.error('Ошибка при получении данных оборудования', error);
      }
    };

    if (equipmentUuid) {
      getEquipmentById();
    }
  }, [equipmentUuid]);

  // Получаем баланс USDT при монтировании компонента
  useEffect(() => {
    if (user_id) {
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
  }, [user_id]);

  // Получаем баланс долей пользователя при монтировании компонента
  useEffect(() => {
    const getUserShareBalance = async () => {
      try {
        if (!user_id || !equipmentId) return;
        const balances = await fetchAllUserBalanceShares(Number(user_id));
        const balancesArray = Object.values(balances);
        const equipmentBalance = balancesArray.find(
          (balance: { equipment_id: number }) =>
            balance.equipment_id === equipmentId,
        );
        setUserShareBalance(equipmentBalance?.balanceShareCount || 0);
      } catch (error) {
        console.error('Ошибка при получении баланса долей:', error);
        setUserShareBalance(0);
      }
    };

    getUserShareBalance();
  }, [user_id, equipmentId]);

  // Рассчитываем общую сумму при изменении количества долей
  useEffect(() => {
    const shareCount = Number(shareCountInput) || 0;
    const total = shareCount * (sharePurchasePrice / totalShareCount);
    setTotalAmount(total);
  }, [shareCountInput, sharePurchasePrice, totalShareCount]);

  const handleCloseModal = () => {
    setTransactionError('');
    setShareCountInput('');
    setShareCountError('');
    onClose();
  };

  const handleShareCountChange = (value: string) => {
    setShareCountInput(value);
    setTransactionError('');
    setShareCountError('');

    const numValue = Number(value);

    if (isNaN(numValue) || numValue <= 0) {
      setShareCountError('Количество долей должно быть положительным числом');
      return;
    }

    const total = numValue * (sharePurchasePrice / totalShareCount);
    if (total > usdtBalance) {
      setShareCountError(
        `Необходимо пополнить баланс на ${(total - usdtBalance).toFixed(2)} USDT`,
      );
      return;
    }
  };

  const handleBuyShares = async () => {
    if (!user_id || !equipmentUuid) return;

    setIsLoading(true);
    try {
      const shareCount = Number(shareCountInput) || 0;
      if (!shareCount || sharePurchasePrice <= 0) {
        setTransactionError('Пожалуйста, заполните все поля корректно');
        Notiflix.Notify.warning('Пожалуйста, заполните все поля корректно');
        return;
      }

      const equipmentData = await fetchEquipmentByUuid(equipmentUuid);
      const equipment = equipmentData[0];

      if (!equipment?.algorithm?.coinTickers?.length) {
        throw new Error('Не удалось определить тикеры монет для оборудования');
      }

      // Создаем депозиты для всех монет алгоритма
      const userEmail = session?.user?.email || '';
      if (userEmail) {
        for (const coinTicker of equipment.algorithm.coinTickers) {
          await ensureBalanceRecordExists(Number(user_id), coinTicker.name);
          await createDepositForCoin(
            Number(user_id),
            userEmail,
            coinTicker.name,
          );
        }
      }

      const updatedShareBalance = userShareBalance + shareCount;

      // Обновляем баланс USDT (true для покупки - списание средств)
      await updateUSDTBalance(Number(user_id), totalAmount, true);

      // Проверяем реферальный бонус
      const { referralBonus: referralPercent, referrerId } =
        await fetchReferralBonus(Number(user_id));
      const bonusAmount = Number(
        (totalAmount * (referralPercent / 100)).toFixed(2),
      );

      // Если есть реферальный бонус, обновляем его
      if (referrerId) {
        await updateReferralBonus(referrerId, bonusAmount);
        await insertReferralBonusTransaction(
          Number(user_id),
          referrerId,
          referralPercent,
          bonusAmount,
        );
      }

      // Записываем транзакцию
      await insertTransactionsTable({
        user_id: Number(user_id),
        equipment_id: equipmentId,
        countShareBuySell: shareCount,
        balanceShareCount: updatedShareBalance,
        pricePerShare: sharePurchasePrice / totalShareCount,
        isPurchase: true,
      });

      if (user_id) {
        const newBalance = await updateEquipmentData(user_id, equipmentId);
        setUserShareBalance(newBalance);
      }

      Notiflix.Notify.success('Покупка успешно совершена');
      handleCloseModal();
    } catch (error) {
      console.error('Error buying shares:', error);
      setTransactionError('Произошла ошибка при покупке долей');
      Notiflix.Notify.failure('Произошла ошибка при покупке долей');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button color='success' onPress={onOpen}>
        Купить
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
            Купить доли {equipmentName}
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
                className='w-full sm:w-[350px] md:w-[400px]'
                disabled
              />
              <Input
                size='sm'
                label='Количество долей'
                labelPlacement='inside'
                placeholder='Количество долей'
                type='number'
                min={1}
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
                value={(sharePurchasePrice / totalShareCount || 0).toString()}
                className='w-full sm:w-[350px] md:w-[400px]'
              />
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
                  totalAmount > usdtBalance ? 'text-danger' : 'text-green-500'
                }`}
              />
              {transactionError && (
                <div className='mt-4 text-danger'>{transactionError}</div>
              )}
            </Form>
          </ModalBody>

          <ModalFooter className='flex flex-col gap-2 sm:flex-row'>
            <Button color='danger' onPress={handleCloseModal}>
              Отменить
            </Button>
            <Button
              color='success'
              onPress={handleBuyShares}
              isDisabled={
                !!shareCountError ||
                !shareCountInput ||
                totalAmount > usdtBalance
              }
            >
              Купить
            </Button>
            {isLoading && <FullScreenSpinner />}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
