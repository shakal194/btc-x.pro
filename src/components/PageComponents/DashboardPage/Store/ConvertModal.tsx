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
import { convertCoins, fetchCoinPrice } from '@/lib/data';
import { ConvertModalProps } from '@/types/equipment';
import FullScreenSpinner from '@/components/ui/Spinner';
import Notiflix from 'notiflix';

export const ConvertModal: React.FC<
  Omit<ConvertModalProps, 'defaultFromCoin'>
> = ({ isOpen, onClose, onSuccess, userId, balances }) => {
  const [fromCoin, setFromCoin] = useState<string>('');
  const [toCoin, setToCoin] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputError, setInputError] = useState<string | null>(null);
  const [isReadyToShow, setIsReadyToShow] = useState(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      let from = '';
      if (balances.length > 0) {
        from = balances.reduce(
          (max, curr) =>
            Number(curr.coinAmount) > Number(max.coinAmount) ? curr : max,
          balances[0],
        ).coinTicker;
      }
      setFromCoin(from);
      const availableToCoins = balances
        .filter((balance) => balance.coinTicker !== from)
        .map((balance) => balance.coinTicker);
      setToCoin(availableToCoins.length > 0 ? availableToCoins[0] : '');
      setAmount('');
      setConvertedAmount(null);
      setError(null);
    }
  }, [isOpen, balances]);

  useEffect(() => {
    if (fromCoin && toCoin === fromCoin) {
      const availableToCoins = balances
        .filter((balance) => balance.coinTicker !== fromCoin)
        .map((balance) => balance.coinTicker);
      setToCoin(availableToCoins.length > 0 ? availableToCoins[0] : '');
    }
  }, [fromCoin, balances]);

  const handleConvert = async () => {
    if (!fromCoin || !toCoin || !amount || Number(amount) <= 0) {
      setError('Пожалуйста, введите положительное число больше 0');
      Notiflix.Notify.warning(
        'Пожалуйста, введите положительное число больше 0',
      );
      return;
    }

    if (fromCoin === toCoin) {
      setError('Нельзя конвертировать монету в саму себя');
      Notiflix.Notify.failure('Нельзя конвертировать монету в саму себя');
      return;
    }

    const fromBalance = balances.find((b) => b.coinTicker === fromCoin);
    if (!fromBalance || Number(fromBalance.coinAmount) <= 0) {
      setError('Недостаточно средств для конвертации');
      Notiflix.Notify.failure('Недостаточно средств для конвертации');
      return;
    }

    if (Number(amount) > Number(fromBalance.coinAmount)) {
      setError('Сумма конвертации превышает доступный баланс');
      Notiflix.Notify.failure('Сумма конвертации превышает доступный баланс');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await convertCoins(userId, fromCoin, toCoin, Number(amount));
      Notiflix.Notify.success('Конвертация успешно выполнена');
      onSuccess();
      onClose();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Произошла ошибка при конвертации';
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
          setInputError('Введите положительное число больше 0');
          return;
        } else if (amountNum > maxAmount) {
          setConvertedAmount(null);
          setInputError('Сумма превышает доступный баланс');
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
          if (isStablecoin(fromCoin) && isStablecoin(toCoin)) {
            preview = amountNum;
          } else {
            const fromPrice = await fetchCoinPrice(fromCoin);
            const toPrice = await fetchCoinPrice(toCoin);
            if (fromPrice && toPrice) {
              preview = (amountNum * fromPrice) / toPrice;
            }
          }
          setConvertedAmount(preview);
          setIsReadyToShow(true);
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
              Выполняется конвертация...
            </span>
          </div>
        )}
        <ModalHeader className='text-white'>
          Конвертация криптовалюты
        </ModalHeader>
        <ModalBody>
          <div className='space-y-4'>
            <Select
              label='Из'
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
              label='Количество'
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
                  Макс.
                </Chip>
              }
            />

            <div className='flex items-center gap-2 text-sm text-white'>
              Вы получите:
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

            {error && <div className='text-sm text-red-500'>{error}</div>}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color='danger' variant='light' onPress={onClose}>
            Отмена
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
            Конвертировать
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
