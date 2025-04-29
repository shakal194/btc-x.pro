'use client';

import { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Chip,
} from '@heroui/react';
import { getAccessToken } from '@/lib/coinsbuy';
import Notiflix from 'notiflix';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import {
  getWalletId,
  getCurrencyId,
  getMinDeposit,
  getCoinNetwork,
} from '@/lib/constants';
import { createWithdrawal, validateOTPCode } from '@/lib/data';
import { useLocale } from 'next-intl';
import FullScreenSpinner from '@/components/ui/Spinner';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: number;
  coinTicker: string;
  balance: number;
  userEmail: string;
}

export default function WithdrawModal({
  isOpen,
  onClose,
  onSuccess,
  userId,
  coinTicker,
  balance,
  userEmail,
}: WithdrawModalProps) {
  const minDeposit = getMinDeposit(coinTicker);
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [addressError, setAddressError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feeAmount, setFeeAmount] = useState<string>('0');
  const [feeInUSDT, setFeeInUSDT] = useState<string>('0');
  const [isFeeCalculated, setIsFeeCalculated] = useState(false);
  const [error, setError] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpError, setOtpError] = useState('');
  const locale = useLocale();

  const canIncludeFee = (ticker: string) => {
    const noFeeInclusionList = [
      'USDT', // USDT-TRX token
      'USDC', // USDC-TRX token
      'TRX',
      'ETH',
      'BNB',
      'MATIC',
      'XRP',
      'ADA',
      'AVAX',
      'XLM',
      'XMR',
      'ARB',
      'OPT',
      'ETH-BASE',
    ];
    return !noFeeInclusionList.includes(ticker);
  };

  const getRate = async () => {
    try {
      const token = await getAccessToken();
      // Для USDT/USDC запрашиваем курс USDT к TRX
      const leftCurrency =
        coinTicker === 'USDT' || coinTicker === 'USDC' ? coinTicker : 'TRX';
      const rightCurrency =
        coinTicker === 'USDT' || coinTicker === 'USDC' ? 'TRX' : coinTicker;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_COINSBUY_API_URL}/rates/?filter[left]=${leftCurrency}&filter[right]=${rightCurrency}`,
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
      const rate = data.data[0].attributes.ask;

      // Для USDT/USDC берем обратный курс
      return coinTicker === 'USDT' || coinTicker === 'USDC'
        ? (1 / Number(rate)).toString()
        : rate;
    } catch (error) {
      console.error('Error fetching rate:', error);
      return '0';
    }
  };

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const calculateFee = async (value: string, withdrawalAddress: string) => {
    try {
      if (!withdrawalAddress) {
        setFeeAmount('Введите адрес');
        setFeeInUSDT('0');
        setAddressError('');
        setIsFeeCalculated(false);
        return;
      }

      setIsFeeCalculated(false);
      const token = await getAccessToken();
      const feeCalcData = {
        data: {
          type: 'payout-calculation',
          attributes: {
            amount: value,
            to_address: withdrawalAddress.trim(),
          },
          relationships: {
            wallet: {
              data: {
                type: 'wallet',
                id: getWalletId(coinTicker),
              },
            },
            currency: {
              data: {
                type: 'currency',
                id: getCurrencyId(coinTicker),
              },
            },
          },
        },
      };

      const feeResponse = await fetch(
        `${process.env.NEXT_PUBLIC_COINSBUY_API_URL}/payout/calculate/`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token.access}`,
            'Content-Type': 'application/vnd.api+json',
          },
          body: JSON.stringify(feeCalcData),
        },
      );

      if (!feeResponse.ok) {
        if (feeResponse.status === 429) {
          const retryAfter = feeResponse.headers.get('Retry-After') || '10';
          const seconds = parseInt(retryAfter, 10);
          Notiflix.Notify.warning(
            `Слишком много запросов. Пожалуйста, подождите ${seconds} секунд.`,
            {
              ID: 'rate-limit',
              timeout: seconds * 1000,
            },
          );
          throw new Error(
            `Rate limit exceeded. Retry after ${seconds} seconds`,
          );
        }
        const errorData = await feeResponse.json();
        const errorDetail = errorData?.errors?.[0]?.detail;

        if (errorDetail?.includes('Incorrect address')) {
          setFeeAmount('0');
          setFeeInUSDT('0');
          setAddressError('Некорректный адрес кошелька');
          throw new Error('Некорректный адрес');
        }

        throw new Error(errorDetail || 'Failed to calculate fee');
      }

      const feeData = await feeResponse.json();

      if (!feeData?.data?.attributes?.fee?.medium) {
        throw new Error('Invalid fee data received from API');
      }

      const calculatedFee = feeData.data.attributes.fee.medium;
      setFeeAmount(calculatedFee);

      // Calculate fee in withdrawal currency if needed
      if (coinTicker === 'USDT' || coinTicker === 'USDC') {
        const rate = await getRate();
        if (!rate || rate === '0') {
          throw new Error('Invalid rate received');
        }
        const feeInCurrency = (Number(calculatedFee) * Number(rate)).toFixed(2);
        setFeeInUSDT(feeInCurrency);
      }

      setIsFeeCalculated(true);
    } catch (error) {
      console.error('Error calculating fee:', error);
      setIsFeeCalculated(false);
      Notiflix.Notify.failure(
        error instanceof Error ? error.message : 'Ошибка при расчете комиссии',
      );
    }
  };

  const handleAmountChange = async (value: string) => {
    // Заменяем запятую на точку и удаляем все нечисловые символы, кроме точки
    const processedValue = value.replace(',', '.').replace(/[^\d.]/g, '');
    const numberRegex = /^\d*\.?\d{0,8}$/;

    if (processedValue === '' || numberRegex.test(processedValue)) {
      setAmount(processedValue);
      setError('');
      setIsFeeCalculated(false);

      if (
        processedValue !== '' &&
        Number(processedValue) > 0 &&
        address.trim()
      ) {
        await calculateFee(processedValue, address);
      } else {
        setFeeAmount('0');
        setFeeInUSDT('0');
      }
    }
  };

  const handleAmountBlur = () => {
    if (amount && !isNaN(Number(amount))) {
      const numValue = parseFloat(amount);
      if (coinTicker === 'USDT' || coinTicker === 'USDC') {
        setAmount(numValue.toFixed(2));
      } else {
        setAmount(numValue.toFixed(8));
      }
    }
  };

  const handleAddressChange = async (value: string) => {
    const trimmedValue = value.trim();
    setAddress(value);
    setAddressError('');
    setIsFeeCalculated(false);

    if (!trimmedValue) {
      setAmount('');
      setFeeAmount('Введите адрес');
      setFeeInUSDT('0');
    } else if (amount && Number(amount) > 0) {
      await calculateFee(amount, trimmedValue);
    }
  };

  const handleMaxAmount = async () => {
    if (!address.trim()) return;

    let maxAmount = balance.toString();
    if (coinTicker === 'USDT' || coinTicker === 'USDC') {
      maxAmount = Number(balance).toFixed(2);
    } else {
      maxAmount = Number(balance).toFixed(8);
    }

    await handleAmountChange(maxAmount);
  };

  const getTotalAmount = () => {
    if (!amount || isNaN(Number(amount))) return 0;
    return coinTicker === 'USDT' || coinTicker === 'USDC'
      ? Number(amount) + Number(feeInUSDT)
      : Number(amount);
  };

  const getAmountError = () => {
    if (!amount || isNaN(Number(amount))) return '';
    const totalAmount = getTotalAmount();
    if (totalAmount > balance) {
      return `Сумма с комиссией (${totalAmount.toFixed(2)} ${coinTicker}) превышает доступные средства`;
    }
    if (Number(amount) < minDeposit) {
      return `Минимальная сумма вывода ${minDeposit} ${coinTicker}`;
    }
    return '';
  };

  const handleGetOTP = async () => {
    if (!amount || !address || !isFeeCalculated) {
      Notiflix.Notify.warning('Пожалуйста, заполните все поля корректно');
      return;
    }

    const amountError = getAmountError();
    if (amountError) {
      Notiflix.Notify.warning(amountError);
      return;
    }

    try {
      setIsLoading(true);
      // Generate 6-digit OTP code
      const generatedOTP = Math.floor(10000 + Math.random() * 90000).toString();

      // Send email with OTP through API
      const response = await fetch('/api/sendWithdrawalOTP', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          otpCode: generatedOTP,
          amount: amount.toString(),
          coinTicker,
          address: address.trim(),
        }),
      });

      // Read response body once
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to send OTP');
      }

      setIsOtpSent(true);
      Notiflix.Notify.success('Код подтверждения отправлен на вашу почту');
    } catch (error) {
      console.error('Error sending OTP:', error);
      Notiflix.Notify.failure(
        error instanceof Error
          ? error.message
          : 'Ошибка при отправке кода подтверждения',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (isLoading) return;

    if (!otpCode || otpCode.length !== 5) {
      setOtpError('Введите корректный код подтверждения');
      return;
    }

    if (!isFeeCalculated) {
      Notiflix.Notify.warning('Дождитесь расчета комиссии');
      return;
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Notiflix.Notify.warning('Пожалуйста, введите корректную сумму');
      return;
    }

    if (!address || address.trim() === '') {
      Notiflix.Notify.warning('Пожалуйста, введите адрес кошелька');
      return;
    }

    const totalAmount = getTotalAmount();
    if (totalAmount > balance) {
      Notiflix.Notify.warning('Недостаточно средств с учетом комиссии');
      return;
    }

    setIsLoading(true);
    try {
      // Verify OTP code
      const isValidOTP = await validateOTPCode(userEmail, otpCode);
      if (!isValidOTP) {
        throw new Error(
          'Неверный код подтверждения или срок его действия истек',
        );
      }

      // Create withdrawal record
      await createWithdrawal({
        userId,
        coinTicker,
        network: getCoinNetwork(coinTicker),
        address: address.trim(),
        amount: amount,
        fee:
          coinTicker === 'USDT' || coinTicker === 'USDC'
            ? feeInUSDT
            : feeAmount,
      });

      onSuccess();
      Notiflix.Notify.success('Запрос на вывод создан успешно');
      handleClose();
    } catch (error) {
      console.error('Error creating withdrawal:', error);
      Notiflix.Notify.failure(
        error instanceof Error
          ? error.message
          : 'Ошибка при создании запроса на вывод',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setAmount('');
    setAddress('');
    setFeeAmount('0');
    setFeeInUSDT('0');
    setIsFeeCalculated(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size='xl'
      className='bg-gray-800'
    >
      <ModalContent>
        <div className='relative'>
          {isLoading && (
            <div className='absolute inset-0 z-50'>
              <FullScreenSpinner />
            </div>
          )}
          <ModalHeader className='text-white'>Вывести {coinTicker}</ModalHeader>
          <ModalBody>
            <div className='space-y-4'>
              <div className='rounded bg-gray-700 p-3'>
                <p className='text-sm text-gray-300'>Доступно для вывода:</p>
                <p className='text-lg font-bold text-green-400'>
                  {balance} {coinTicker}
                </p>
              </div>

              <Input
                type='text'
                label={`Адрес ${coinTicker}`}
                value={address}
                onChange={(e) => handleAddressChange(e.target.value)}
                placeholder={`Введите адрес ${coinTicker}`}
                className='w-full'
                isInvalid={!!addressError}
                errorMessage={addressError}
              />

              <Input
                type='text'
                inputMode='decimal'
                label={`Сумма ${coinTicker}`}
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                onBlur={handleAmountBlur}
                placeholder='Введите сумму'
                className='w-full'
                isDisabled={!address.trim()}
                isInvalid={!!getAmountError()}
                errorMessage={getAmountError()}
                endContent={
                  <Chip
                    color='secondary'
                    size='sm'
                    className='cursor-pointer'
                    onClick={handleMaxAmount}
                  >
                    Макс.
                  </Chip>
                }
              />
              <Input
                type='text'
                label='Код подтверждения'
                value={otpCode}
                onChange={(e) => {
                  setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 5));
                  setOtpError('');
                }}
                placeholder='Введите код из письма'
                className='flex-1'
                maxLength={5}
                isInvalid={!!otpError}
                errorMessage={otpError}
                endContent={
                  <Button
                    color='primary'
                    className='self-end'
                    onPress={handleGetOTP}
                    isDisabled={
                      !amount || !address || !isFeeCalculated || isLoading
                    }
                  >
                    Получить код
                  </Button>
                }
              />
              <div className='rounded bg-gray-700 p-3'>
                <div className='flex items-center gap-2 text-sm font-bold text-yellow-400'>
                  <ExclamationTriangleIcon className='h-6 w-6' />
                  <p>Внимание:</p>
                </div>
                <ul className='mt-2 list-inside list-disc space-y-4 text-sm text-gray-300'>
                  <li>
                    Минимальная сумма вывода: {minDeposit} {coinTicker}
                  </li>
                  <li>Комиссия сети будет рассчитана автоматически</li>
                  <li>
                    Комиссия сети примерно:{' '}
                    <Chip color='danger' size='sm' variant='shadow'>
                      {feeAmount}
                      {coinTicker === 'USDT' || coinTicker === 'USDC'
                        ? ` TRX (≈$${feeInUSDT} ${coinTicker})`
                        : ''}
                    </Chip>
                  </li>
                  {(coinTicker === 'USDT' || coinTicker === 'USDC') && (
                    <li>
                      Итого с баланса спишется:{' '}
                      <Chip color='success' size='sm' variant='shadow'>
                        {Number(Number(amount) + Number(feeInUSDT)).toFixed(2)}{' '}
                        {coinTicker}
                      </Chip>
                    </li>
                  )}
                  <li>Вывод средств обрабатывается в течение 24 часов</li>
                </ul>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color='danger' variant='light' onPress={handleClose}>
              Закрыть
            </Button>
            <Button
              color='success'
              onPress={handleWithdraw}
              isDisabled={
                !amount ||
                !address ||
                !isFeeCalculated ||
                !isOtpSent ||
                !otpCode ||
                otpCode.length !== 5 ||
                Number(getTotalAmount()) > balance ||
                Number(amount) < minDeposit
              }
            >
              Создать запрос
            </Button>
          </ModalFooter>
        </div>
      </ModalContent>
    </Modal>
  );
}
