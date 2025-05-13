'use client';

import { useState, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Chip,
  Select,
  SelectItem,
  Spinner,
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
import { useTranslations } from 'next-intl';
import FullScreenSpinner from '@/components/ui/Spinner';
import { formatCoinTicker, formatNumber } from '@/lib/utils';

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
  const t = useTranslations(
    'cloudMiningPage.dashboard.userContent.withdrawModal',
  );
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

  const canIncludeFee = (ticker: string) => {
    const noFeeInclusionList = [
      'USDT_SOL', // USDT-SOL token
      'USDC_SOL', // USDC-SOL token
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

      // Определяем валюты для запроса курса
      let leftCurrency = 'USDT'; // Всегда используем USDT как базовую валюту для конвертации
      let rightCurrency = 'SOL'; // Всегда используем SOL для USDT_SOL и USDC_SOL

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

      // Для всех случаев берем обратный курс, так как нам нужно конвертировать из SOL в USDT
      const finalRate = (1 / Number(rate)).toString();

      return finalRate;
    } catch (error) {
      console.error(t('errorGettingRate'), error);
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
          Notiflix.Notify.warning(t('rateLimitExceeded', { seconds }), {
            ID: 'rate-limit',
            timeout: seconds * 1000,
          });
          throw new Error(t('rateLimitExceeded', { seconds }));
        }
        const errorData = await feeResponse.json();
        const errorDetail = errorData?.errors?.[0]?.detail;

        if (errorDetail?.includes('Incorrect address')) {
          setFeeAmount('0');
          setFeeInUSDT('0');
          setAddressError(t('incorrectAddress'));
          throw new Error(t('incorrectAddress'));
        }

        if (errorDetail?.toLowerCase().includes('insufficient funds')) {
          throw new Error(t('insufficientFunds'));
        }

        throw new Error(errorDetail || t('failedToCalculateFee'));
      }

      const feeData = await feeResponse.json();
      console.log('Fee calculation response:', feeData); // Debug log

      if (!feeData?.data?.attributes?.fee?.medium) {
        throw new Error(t('invalidFeeDataReceivedFromAPI'));
      }

      const calculatedFee = feeData.data.attributes.fee.medium;
      setFeeAmount(calculatedFee);

      // Calculate fee in withdrawal currency if needed
      if (coinTicker === 'USDT_SOL' || coinTicker === 'USDC_SOL') {
        const rate = await getRate();

        if (!rate || rate === '0') {
          throw new Error(t('invalidRateReceived'));
        }

        const feeInCurrency = (Number(calculatedFee) * Number(rate)).toFixed(2);
        setFeeInUSDT(feeInCurrency);
      }

      setIsFeeCalculated(true);
    } catch (error) {
      console.error(t('errorCalculatingFee'), error);
      setIsFeeCalculated(false);
      Notiflix.Notify.failure(
        error instanceof Error ? error.message : t('errorCalculatingFee'),
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
      if (coinTicker === 'USDT_SOL' || coinTicker === 'USDC_SOL') {
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
      setFeeAmount(t('enterWithdrawalAddress'));
      setFeeInUSDT('0');
    } else if (amount && Number(amount) > 0) {
      await calculateFee(amount, trimmedValue);
    }
  };

  const handleMaxAmount = async () => {
    if (!address.trim()) {
      Notiflix.Notify.warning(t('enterWithdrawalAddress'));
      return;
    }

    try {
      // Сначала рассчитаем комиссию для максимальной суммы
      await calculateFee(balance.toString(), address);

      // После расчета комиссии вычисляем максимально доступную сумму
      let maxAvailable = balance;

      if (coinTicker === 'USDT_SOL' || coinTicker === 'USDC_SOL') {
        // Для USDT/USDC (SOL) устанавливаем полный баланс,
        // так как комиссия уже будет учтена в проверке getTotalAmount
        maxAvailable = balance;
      }

      let formattedAmount = maxAvailable.toString();
      if (coinTicker === 'USDT_SOL' || coinTicker === 'USDC_SOL') {
        formattedAmount = maxAvailable.toFixed(2);
      } else {
        formattedAmount = maxAvailable.toFixed(8);
      }

      // Устанавливаем максимальную сумму
      await handleAmountChange(formattedAmount);

      // Дополнительная проверка для USDT_SOL/USDC_SOL
      if (
        (coinTicker === 'USDT_SOL' || coinTicker === 'USDC_SOL') &&
        Number(feeInUSDT) > 0
      ) {
        const totalWithFee = Number(maxAvailable) + Number(feeInUSDT);
        if (totalWithFee > balance) {
          const actualMax = Math.max(0, balance - Number(feeInUSDT));
          await handleAmountChange(actualMax.toFixed(2));
        }
      }
    } catch (error) {
      console.error(t('errorCalculatingMaxAmount'), error);
      Notiflix.Notify.failure(t('errorCalculatingMaxAmount'));
    }
  };

  const getTotalAmount = () => {
    if (!amount || isNaN(Number(amount))) return 0;
    // Учитываем комиссию в USDT для всех стейблкоинов
    if (coinTicker === 'USDT_SOL' || coinTicker === 'USDC_SOL') {
      return Number(amount) + Number(feeInUSDT);
    }
    return Number(amount);
  };

  const getAmountError = () => {
    if (!amount || isNaN(Number(amount))) return '';
    const totalAmount = getTotalAmount();
    if (totalAmount > balance) {
      return t('totalAmountExceedsBalance', {
        totalAmount: totalAmount.toFixed(2),
        coinTicker,
      });
    }
    if (Number(amount) < minDeposit) {
      return t('minWithdrawAmount', {
        minDeposit,
        coinTicker,
      });
    }
    return '';
  };

  const handleGetOTP = async () => {
    if (!amount || !address || !isFeeCalculated) {
      Notiflix.Notify.warning(t('pleaseFillAllFieldsCorrectly'));
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

      // Подготовка данных для отправки
      const requestData = {
        email: userEmail,
        otpCode: generatedOTP,
        amount: amount.toString(),
        coinTicker: formatCoinTicker(coinTicker), // Используем отформатированный тикер
        address: address.trim(),
        fee: feeAmount,
        feeInUSDT: feeInUSDT,
        totalAmount: Number(Number(amount) + Number(feeInUSDT)).toFixed(2),
      };

      // Send email with OTP through API
      const response = await fetch('/api/sendWithdrawalOTP', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      // Read response body once
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.error || responseData.message || t('failedToSendOTP'),
        );
      }

      setIsOtpSent(true);
      Notiflix.Notify.success(t('otpSentToEmail'));
    } catch (error) {
      console.error('Error sending OTP:', error);
      Notiflix.Notify.failure(
        error instanceof Error ? error.message : t('errorSendingOTP'),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (isLoading) return;

    if (!otpCode || otpCode.length !== 5) {
      setOtpError(t('enterCorrectOTPCode'));
      return;
    }

    if (!isFeeCalculated) {
      Notiflix.Notify.warning(t('waitForFeeCalculation'));
      return;
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Notiflix.Notify.warning(t('enterCorrectAmount'));
      return;
    }

    if (!address || address.trim() === '') {
      Notiflix.Notify.warning(t('enterWalletAddress'));
      return;
    }

    const totalAmount = getTotalAmount();
    if (totalAmount > balance) {
      Notiflix.Notify.warning(t('insufficientFunds'));
      return;
    }

    setIsLoading(true);
    try {
      // Verify OTP code
      const isValidOTP = await validateOTPCode(userEmail, otpCode);
      if (!isValidOTP) {
        throw new Error(t('invalidOTPCode'));
      }

      // Create withdrawal record
      await createWithdrawal({
        userId,
        coinTicker,
        network: getCoinNetwork(coinTicker),
        address: address.trim(),
        amount: amount,
        feeInUSDT: feeInUSDT,
        feeInCoin: feeAmount,
      });

      onSuccess();
      Notiflix.Notify.success(t('withdrawalRequestCreatedSuccessfully'));
      handleClose();
    } catch (error) {
      console.error('Error creating withdrawal:', error);
      // Показываем уведомление только если это не ошибка insufficient funds
      if (!(error instanceof Error && error.message === 'insufficient_funds')) {
        Notiflix.Notify.failure(
          error instanceof Error ? error.message : t('errorCreatingWithdrawal'),
        );
      }
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
        {isLoading && (
          <div className='absolute inset-0 z-50'>
            <FullScreenSpinner />
          </div>
        )}
        <ModalHeader className='text-white'>
          {t('withdraw_modal_title')} {formatCoinTicker(coinTicker)}
        </ModalHeader>
        <ModalBody>
          <div className='space-y-4'>
            <div className='rounded bg-gray-700 p-3'>
              <p className='text-sm text-gray-300'>
                {t('available_for_withdrawal')}:
              </p>
              <p className='text-lg font-bold text-green-400'>
                {formatNumber(Number(balance), 8)}{' '}
                {formatCoinTicker(coinTicker)}
              </p>
            </div>

            <Input
              type='text'
              label={`${t('address')} ${formatCoinTicker(coinTicker)}`}
              value={address}
              onChange={(e) => handleAddressChange(e.target.value)}
              placeholder={`${t('enter_address')} ${formatCoinTicker(coinTicker)}`}
              className='w-full'
              isInvalid={!!addressError}
              errorMessage={addressError}
            />

            <Input
              type='text'
              inputMode='decimal'
              label={`${t('amount')} ${formatCoinTicker(coinTicker)}`}
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              onBlur={handleAmountBlur}
              placeholder={`${t('enter_amount')}`}
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
                  {t('max')}
                </Chip>
              }
            />
            <Input
              type='text'
              label={t('otp_code')}
              value={otpCode}
              onChange={(e) => {
                setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 5));
                setOtpError('');
              }}
              placeholder={t('enter_otp_code')}
              className='flex-1'
              maxLength={5}
              isInvalid={!!otpError}
              errorMessage={otpError}
              endContent={
                <Chip
                  color='secondary'
                  className='cursor-pointer'
                  onClick={handleGetOTP}
                  isDisabled={
                    !amount || !address || !isFeeCalculated || isLoading
                  }
                >
                  {t('get_otp_code')}
                </Chip>
              }
            />
            <div className='rounded bg-gray-700 p-3'>
              <div className='flex items-center gap-2 text-sm font-bold text-yellow-400'>
                <ExclamationTriangleIcon className='h-6 w-6' />
                <p>{t('attention')}</p>
              </div>
              <ul className='mt-2 list-inside list-disc space-y-4 text-sm text-gray-300'>
                <li>
                  {t('min_withdraw_amount')}: {minDeposit}{' '}
                  {formatCoinTicker(coinTicker)}
                </li>
                <li>{t('network_fee_will_be_calculated_automatically')}</li>
                <li>
                  {t('network_fee_approximately')}:{' '}
                  <Chip color='danger' size='sm' variant='shadow'>
                    {feeAmount}
                    {coinTicker === 'USDT_SOL' || coinTicker === 'USDC_SOL'
                      ? ` SOL (≈$${feeInUSDT} ${formatCoinTicker(coinTicker)})`
                      : ''}
                  </Chip>
                </li>
                {(coinTicker === 'USDT_SOL' || coinTicker === 'USDC_SOL') && (
                  <li>
                    {t('total_amount_will_be_debited_from_balance')}:{' '}
                    <Chip color='success' size='sm' variant='shadow'>
                      {Number(Number(amount) + Number(feeInUSDT)).toFixed(2)}{' '}
                      {formatCoinTicker(coinTicker)}
                    </Chip>
                  </li>
                )}
                <li>{t('withdrawal_processing_time')}</li>
              </ul>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color='danger' variant='light' onPress={handleClose}>
            {t('close')}
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
            {t('create_request')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
