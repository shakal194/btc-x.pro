'use client';
import { useState, useEffect, useCallback } from 'react';
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
  Card,
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
  fetchAllUserBalances,
} from '@/lib/data';
import Notiflix from 'notiflix';
import { createDepositForCoin } from '@/lib/balance';
import FullScreenSpinner from '@/components/ui/Spinner';
import { ConvertModal } from '@/components/PageComponents/DashboardPage/Store/ConvertModal';
import type { Balance } from '@/types/equipment';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('cloudMiningPage.dashboard.userContent');
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
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [userBalances, setUserBalances] = useState<Balance[]>([]);

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
        console.error(t('errorGetEquipmentData'), error);
      }
    };

    if (equipmentUuid) {
      getEquipmentById();
    }
  }, [equipmentUuid, t]);

  // Вынесем функцию загрузки баланса USDT
  const fetchAndSetUsdtBalance = useCallback(async () => {
    if (user_id) {
      try {
        const balance = await fetchUSDTBalance(Number(user_id));
        setUsdtBalance(Number(balance) || 0);
      } catch (error) {
        console.error(t('errorGetUsdtBalance'), error);
        setUsdtBalance(0);
      }
    }
  }, [user_id, t]);

  // Получаем баланс USDT при монтировании компонента
  useEffect(() => {
    fetchAndSetUsdtBalance();
  }, [fetchAndSetUsdtBalance]);

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
        console.error(t('errorGetShareBalance'), error);
        setUserShareBalance(0);
      }
    };

    getUserShareBalance();
  }, [user_id, equipmentId, t]);

  // Рассчитываем общую сумму при изменении количества долей
  useEffect(() => {
    const shareCount = Number(shareCountInput) || 0;
    const total = shareCount * (sharePurchasePrice / totalShareCount);
    setTotalAmount(total);
  }, [shareCountInput, sharePurchasePrice, totalShareCount]);

  useEffect(() => {
    async function loadBalances() {
      if (!user_id) return;
      try {
        const balances = await fetchAllUserBalances(Number(user_id));
        setUserBalances(balances);
      } catch (error) {
        console.error(t('errorGetBalances'), error);
        setUserBalances([]);
      }
    }
    loadBalances();
  }, [user_id, t]);

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
      setShareCountError(t('shareCountError'));
      return;
    }

    const total = numValue * (sharePurchasePrice / totalShareCount);
    if (total > usdtBalance) {
      setShareCountError(
        t('needToTopUpBalance', { amount: (total - usdtBalance).toFixed(2) }),
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
        setTransactionError(t('pleaseFillAllFieldsCorrectly'));
        Notiflix.Notify.warning(t('pleaseFillAllFieldsCorrectly'));
        return;
      }

      const equipmentData = await fetchEquipmentByUuid(equipmentUuid);
      const equipment = equipmentData[0];

      if (!equipment?.algorithm?.coinTickers?.length) {
        throw new Error(t('errorGetEquipmentData'));
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
        (totalAmount * (parseFloat(referralPercent) / 100)).toFixed(2),
      );

      // Если есть реферальный бонус, обновляем его
      if (referrerId) {
        await updateReferralBonus(referrerId, bonusAmount);
        await insertReferralBonusTransaction(
          Number(user_id),
          referrerId,
          parseFloat(referralPercent),
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
        {t('buy')}
      </Button>

      <Modal
        isOpen={isOpen}
        size='xl'
        placement='center'
        scrollBehavior='outside'
        onClose={handleCloseModal}
        className='bg-default-800'
      >
        <ModalContent>
          <ModalHeader className='flex flex-col gap-1 text-white'>
            {t('buy')} {equipmentName}
          </ModalHeader>

          <ModalBody className='mx-auto'>
            {/* Уведомление и кнопка конвертации */}
            <div className='mb-4 flex items-center gap-2'>
              <span className='text-sm font-medium text-warning'>
                {t('buy_shares_only_usdt')}
              </span>
              <Button
                size='sm'
                color='secondary'
                variant='bordered'
                onPress={() => setIsConvertModalOpen(true)}
              >
                {t('convert_to_usdt')}
              </Button>
            </div>

            <Form>
              <Input
                size='sm'
                label={t('equipmentName')}
                labelPlacement='inside'
                placeholder={t('equipmentName')}
                isRequired
                value={equipmentName}
                className='w-full sm:w-[350px] md:w-[400px]'
                disabled
              />
              <Input
                size='sm'
                label={t('shareCount')}
                labelPlacement='inside'
                placeholder={t('shareCount')}
                type='number'
                min={1}
                isRequired
                value={shareCountInput}
                onChange={(e) => handleShareCountChange(e.target.value)}
                className='w-full sm:w-[350px] md:w-[400px]'
                isInvalid={!!shareCountError}
                errorMessage={shareCountError}
              />

              <div className='mt-2 w-full space-y-3 sm:w-[350px] md:w-[400px]'>
                <Card className='p-3'>
                  <div className='mb-1 text-xs text-gray-500'>
                    {t('shareCount')}
                  </div>
                  <div className='font-mono text-lg font-bold text-gray-900'>
                    {userShareBalance > 0 ? userShareBalance : 0}
                  </div>
                </Card>
                <Card className='p-3'>
                  <div className='mb-1 text-xs text-gray-500'>
                    {t('sellPriceOneShare')}
                  </div>
                  <div className='font-mono text-lg font-bold text-gray-900'>
                    {(sharePurchasePrice / totalShareCount || 0).toFixed(2)}
                  </div>
                </Card>
                <Card className='p-3'>
                  <div className='mb-1 text-xs text-gray-500'>
                    {t('usdtBalance')}
                  </div>
                  <div className='font-mono text-lg font-bold text-gray-900'>
                    {usdtBalance.toFixed(2)}
                  </div>
                </Card>
                <Card className='p-3'>
                  <div className='mb-1 text-xs text-gray-500'>
                    {t('totalAmount')}
                  </div>
                  <div
                    className={`font-mono text-lg font-bold ${totalAmount > usdtBalance ? 'text-red-600' : 'text-green-600'}`}
                  >
                    {totalAmount.toFixed(2)}
                  </div>
                </Card>
              </div>
              {transactionError && (
                <div className='mt-4 text-danger'>{transactionError}</div>
              )}
            </Form>
          </ModalBody>

          <ModalFooter className='flex flex-col gap-2 sm:flex-row'>
            <Button color='danger' onPress={handleCloseModal}>
              {t('cancel')}
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
              {t('buy')}
            </Button>
            {isLoading && <FullScreenSpinner />}
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Модалка конвертации (пример, если компонент уже есть) */}
      {isConvertModalOpen && (
        <ConvertModal
          isOpen={isConvertModalOpen}
          onClose={() => setIsConvertModalOpen(false)}
          onSuccess={() => {
            setIsConvertModalOpen(false);
            fetchAndSetUsdtBalance(); // обновляем баланс после конвертации
            setShareCountError(''); // сбрасываем ошибку количества долей
            setTransactionError(''); // сбрасываем ошибку транзакции
          }}
          userId={Number(user_id)}
          balances={userBalances}
        />
      )}
    </div>
  );
}
