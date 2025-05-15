'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Selection,
  Chip,
  Spinner,
} from '@heroui/react';
import { ArrowPathRoundedSquareIcon } from '@heroicons/react/24/outline';
import { fetchCoinPrice, convertCoins } from '@/lib/data';
import { ConvertModalProps } from '@/types/equipment';
import FullScreenSpinner from '@/components/ui/Spinner';
import Notiflix from 'notiflix';
import { useTranslations } from 'next-intl';

export const ConvertModal: React.FC<ConvertModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  userId,
  balances,
  defaultFromCoin,
}) => {
  const t = useTranslations(
    'cloudMiningPage.dashboard.userContent.convertModal',
  );
  const [fromCoin, setFromCoin] = useState<string>('');
  const [toCoin, setToCoin] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputError, setInputError] = useState<string | null>(null);
  const [isReadyToShow, setIsReadyToShow] = useState(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const availableCoins = balances.map((balance) => balance.coinTicker);

  useEffect(() => {
    if (isOpen) {
      let from = '';
      if (defaultFromCoin) {
        from = defaultFromCoin;
      } else if (balances.length > 0) {
        from = balances.reduce(
          (max, curr) =>
            Number(curr.coinAmount) > Number(max.coinAmount) ? curr : max,
          balances[0],
        ).coinTicker;
      }
      setFromCoin(from);
      // Выбираем первую доступную монету, отличную от from
      const availableToCoins = balances
        .filter((balance) => balance.coinTicker !== from)
        .map((balance) => balance.coinTicker);
      setToCoin(availableToCoins.length > 0 ? availableToCoins[0] : '');
      setAmount('');
      setConvertedAmount(null);
      setError(null);
    }
  }, [isOpen, defaultFromCoin, balances]);

  // Добавляем эффект для обновления toCoin при изменении fromCoin
  useEffect(() => {
    if (fromCoin && toCoin === fromCoin) {
      const availableToCoins = balances
        .filter((balance) => balance.coinTicker !== fromCoin)
        .map((balance) => balance.coinTicker);
      setToCoin(availableToCoins.length > 0 ? availableToCoins[0] : '');
    }
  }, [fromCoin, toCoin, balances]);

  useEffect(() => {
    if (fromCoin && toCoin && amount) {
      const convertAmount = async () => {
        try {
          // Проверяем, являются ли монеты стейблкоинами
          const isStablecoinPair =
            (fromCoin === 'USDT_SOL' && toCoin === 'USDC_SOL') ||
            (fromCoin === 'USDC_SOL' && toCoin === 'USDT_SOL');

          if (isStablecoinPair) {
            // Для стейблкоинов используем конвертацию 1:1
            setConvertedAmount(parseFloat(amount));
          } else {
            // Для остальных монет получаем цены с Binance
            const fromPrice = await fetchCoinPrice(fromCoin);
            const toPrice = await fetchCoinPrice(toCoin);

            if (fromPrice && toPrice) {
              const result = (parseFloat(amount) * fromPrice) / toPrice;
              setConvertedAmount(result);
            }
          }
        } catch (error) {
          console.error(t('error_converting_amount'), error);
          setError(t('error_converting_amount'));
        }
      };

      convertAmount();
    }
  }, [fromCoin, toCoin, amount, t]);

  const handleConvert = async () => {
    if (!fromCoin || !toCoin || !amount || Number(amount) <= 0) {
      setError(t('please_enter_positive_number'));
      Notiflix.Notify.warning(t('please_enter_positive_number'));
      return;
    }

    if (fromCoin === toCoin) {
      setError(t('cannot_convert_coin_to_itself'));
      Notiflix.Notify.failure(t('cannot_convert_coin_to_itself'));
      return;
    }

    const fromBalance = balances.find((b) => b.coinTicker === fromCoin);
    if (!fromBalance || Number(fromBalance.coinAmount) <= 0) {
      setError(t('not_enough_funds_for_conversion'));
      Notiflix.Notify.failure(t('not_enough_funds_for_conversion'));
      return;
    }

    if (Number(amount) > Number(fromBalance.coinAmount)) {
      setError(t('amount_exceeds_balance'));
      Notiflix.Notify.failure(t('amount_exceeds_balance'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await convertCoins(userId, fromCoin, toCoin, Number(amount));
      Notiflix.Notify.success(t('conversion_successful'));
      onSuccess();
      onClose();
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : t('error_occurred_during_conversion');
      setError(errorMessage);
      Notiflix.Notify.failure(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwapCoins = () => {
    const temp = fromCoin;
    setFromCoin(toCoin);
    setToCoin(temp);
    setAmount('');
    setConvertedAmount(null);
    setError(null);
  };

  const handleAmountChange = (value: string) => {
    // Заменяем запятую на точку и удаляем все нечисловые символы, кроме точки
    const processedValue = value.replace(',', '.').replace(/[^\d.]/g, '');
    const numberRegex = /^\d*\.?\d{0,8}$/;

    if (processedValue === '' || numberRegex.test(processedValue)) {
      setAmount(processedValue);
      setIsReadyToShow(false);
      if (!fromCoin || !toCoin || !processedValue) {
        setConvertedAmount(null);
        setInputError(null);
        return;
      }

      try {
        const amountNum = Number(processedValue);
        const fromBalance = balances.find((b) => b.coinTicker === fromCoin);
        const maxAmount = fromBalance ? Number(fromBalance.coinAmount) : 0;
        if (isNaN(amountNum) || amountNum <= 0) {
          setConvertedAmount(null);
          setInputError(t('please_enter_positive_number'));
          return;
        } else if (amountNum > maxAmount) {
          setConvertedAmount(null);
          setInputError(t('amount_exceeds_balance'));
          return;
        } else {
          setInputError(null);
        }

        // Debounce расчёта курса с isReadyToShow
        if (debounceTimeout.current) {
          clearTimeout(debounceTimeout.current);
        }
        debounceTimeout.current = setTimeout(async () => {
          const isStablecoin = (coin: string) =>
            coin === 'USDT_SOL' || coin === 'USDC_SOL';

          let preview = null;
          try {
            if (isStablecoin(fromCoin) && isStablecoin(toCoin)) {
              // Если конвертируем между стейблкоинами, используем курс 1:1
              preview = amountNum;
            } else if (isStablecoin(fromCoin)) {
              // Если конвертируем из стейблкоина, используем только цену целевой монеты
              const toPrice = await fetchCoinPrice(toCoin);
              if (toPrice) {
                preview = amountNum / toPrice;
              }
            } else if (isStablecoin(toCoin)) {
              // Если конвертируем в стейблкоин, используем только цену исходной монеты
              const fromPrice = await fetchCoinPrice(fromCoin);
              if (fromPrice) {
                preview = amountNum * fromPrice;
              }
            } else {
              // Для конвертации между обычными монетами используем обе цены
              const fromPrice = await fetchCoinPrice(fromCoin);
              const toPrice = await fetchCoinPrice(toCoin);
              if (fromPrice && toPrice) {
                preview = (amountNum * fromPrice) / toPrice;
              }
            }
            setConvertedAmount(preview);
            setIsReadyToShow(true);
          } catch (error) {
            console.error('Error calculating conversion:', error);
            setConvertedAmount(null);
            setIsReadyToShow(false);
          }
        }, 700);
      } catch (err) {
        setConvertedAmount(null);
        setIsReadyToShow(false);
      }
    }
  };

  const handleMaxAmount = () => {
    const fromBalance = balances.find((b) => b.coinTicker === fromCoin);
    if (fromBalance) {
      handleAmountChange(fromBalance.coinAmount);
    }
  };

  const getDecimalPlaces = () => {
    const isStablecoin = (coin: string) =>
      coin === 'USDT_SOL' || coin === 'USDC_SOL';

    return isStablecoin(fromCoin) && isStablecoin(toCoin) ? 2 : 8;
  };

  const formatBalance = (balance: {
    coinTicker: string;
    coinAmount: string;
  }) => {
    if (balance.coinTicker === 'USDT_SOL') {
      return 'USDT(SOL)';
    } else if (balance.coinTicker === 'USDC_SOL') {
      return 'USDC(SOL)';
    }
    return balance.coinTicker;
  };

  const getBalanceForCoin = (coinTicker: string) => {
    const balance = balances.find((b) => b.coinTicker === coinTicker);
    return balance ? Number(balance.coinAmount).toFixed(8) : '0.00000000';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size='xl' className='bg-gray-800'>
      <ModalContent>
        {isLoading && (
          <div className='absolute inset-0 z-50 flex flex-col items-center justify-center gap-4 rounded-lg bg-black/50'>
            <FullScreenSpinner />
            <span className='text-lg font-medium text-white'>
              {t('converting')}
            </span>
          </div>
        )}
        <ModalHeader className='text-white'>
          {t('convert_modal_title')}
        </ModalHeader>
        <ModalBody>
          <div className='space-y-4'>
            <Select
              label={t('from')}
              selectedKeys={fromCoin ? new Set([fromCoin]) : new Set()}
              onSelectionChange={(keys: Selection) => {
                const selectedKey = Array.from(keys)[0];
                if (typeof selectedKey === 'string') {
                  setFromCoin(selectedKey);
                }
              }}
              endContent={
                <div className='pointer-events-none flex items-center'>
                  <span className='text-gray-400'>
                    {fromCoin ? getBalanceForCoin(fromCoin) : ''}
                  </span>
                </div>
              }
            >
              {balances.map((balance) => (
                <SelectItem
                  key={balance.coinTicker}
                  endContent={
                    <div className='pointer-events-none flex items-center'>
                      <span className='text-gray-400'>
                        {Number(balance.coinAmount).toFixed(8)}
                      </span>
                    </div>
                  }
                >
                  {formatBalance(balance)}
                </SelectItem>
              ))}
            </Select>

            <div className='flex justify-center'>
              <Button
                isIconOnly
                variant='light'
                onPress={handleSwapCoins}
                className='text-white'
              >
                <ArrowPathRoundedSquareIcon className='h-6 w-6' />
              </Button>
            </div>

            <Select
              label='В'
              selectedKeys={toCoin ? new Set([toCoin]) : new Set()}
              onSelectionChange={(keys: Selection) => {
                const selectedKey = Array.from(keys)[0];
                if (typeof selectedKey === 'string') {
                  setToCoin(selectedKey);
                }
              }}
              endContent={
                <div className='pointer-events-none flex items-center'>
                  <span className='text-gray-400'>
                    {toCoin ? getBalanceForCoin(toCoin) : ''}
                  </span>
                </div>
              }
            >
              {balances
                .filter((balance) => balance.coinTicker !== fromCoin)
                .map((balance) => (
                  <SelectItem
                    key={balance.coinTicker}
                    endContent={
                      <div className='pointer-events-none flex items-center'>
                        <span className='text-gray-400'>
                          {Number(balance.coinAmount).toFixed(8)}
                        </span>
                      </div>
                    }
                  >
                    {formatBalance(balance)}
                  </SelectItem>
                ))}
            </Select>

            <Input
              label={t('amount')}
              value={amount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleAmountChange(e.target.value)
              }
              isInvalid={!!inputError}
              errorMessage={inputError}
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

            <div className='flex items-center gap-2 text-sm text-white'>
              {t('you_will_receive')}
              {!amount || inputError ? (
                <span className='ml-1 opacity-60'>...</span>
              ) : !isReadyToShow ? (
                <Spinner size='sm' color='secondary' className='ml-1' />
              ) : (
                <span className='ml-1'>
                  {convertedAmount?.toFixed(getDecimalPlaces())}{' '}
                  {formatBalance({ coinTicker: toCoin, coinAmount: '0' })}
                </span>
              )}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color='danger' variant='light' onPress={onClose}>
            {t('cancel')}
          </Button>
          <Button
            color='success'
            onPress={handleConvert}
            isDisabled={
              !fromCoin ||
              !toCoin ||
              !amount ||
              isLoading ||
              !!inputError ||
              !!error
            }
          >
            {t('convert')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
