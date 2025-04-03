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
import { getWalletId, getCurrencyId, getMinDeposit } from '@/lib/constants';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: number;
  userEmail: string;
  coinTicker: string;
  balance: number;
}

export default function WithdrawModal({
  isOpen,
  onClose,
  onSuccess,
  userId,
  userEmail,
  coinTicker,
  balance,
}: WithdrawModalProps) {
  const minDeposit = getMinDeposit(coinTicker);
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feeAmount, setFeeAmount] = useState<string>('0');
  const [feeInUSDT, setFeeInUSDT] = useState<string>('0');

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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_COINSBUY_API_URL}/rates/?filter[left]=TRX&filter[right]=${coinTicker}`,
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

      return data.data[0].attributes.ask;
    } catch (error) {
      console.error('Error fetching rate:', error);
      return '0';
    }
  };

  const calculateFee = async (value: string) => {
    if (!value || isNaN(Number(value)) || Number(value) <= 0) return;

    try {
      const token = await getAccessToken();
      const feeCalcData = {
        data: {
          type: 'payout-calculation',
          attributes: {
            amount: value,
            to_address: address,
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
        const errorData = await feeResponse.json();
        throw new Error(
          errorData?.errors?.[0]?.detail || 'Failed to calculate fee',
        );
      }

      const feeData = await feeResponse.json();
      const fee = feeData.data.attributes.fee.medium;
      setFeeAmount(fee);

      if (coinTicker === 'USDT' || coinTicker === 'USDC') {
        const rate = await getRate();
        const feeInUSDT = (Number(fee) * Number(rate)).toFixed(2);
        setFeeInUSDT(feeInUSDT);
      }
    } catch (error) {
      setFeeAmount('Error calculating fee');
      setFeeInUSDT('0');
    }
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    calculateFee(value);
  };

  const handleWithdraw = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Notiflix.Notify.warning('Пожалуйста, введите корректную сумму');
      return;
    }

    if (!address) {
      Notiflix.Notify.warning('Пожалуйста, введите адрес кошелька');
      return;
    }

    const totalAmount =
      coinTicker === 'USDT'
        ? Number(amount) + Number(feeInUSDT)
        : Number(amount);

    if (totalAmount > balance) {
      Notiflix.Notify.warning('Недостаточно средств с учетом комиссии');
      return;
    }

    setIsLoading(true);
    try {
      const token = await getAccessToken();

      // Сначала получаем расчет комиссии
      const feeCalcData = {
        data: {
          type: 'payout-calculation',
          attributes: {
            amount: amount.toString(),
            to_address: address,
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
        const errorData = await feeResponse.json();
        throw new Error(
          errorData?.errors?.[0]?.detail || 'Failed to calculate fee',
        );
      }

      const feeData = await feeResponse.json();
      const calculatedFee = feeData.data.attributes.fee.medium;
      setFeeAmount(calculatedFee);

      // Теперь создаем вывод с полученной комиссией
      const payoutData = {
        data: {
          type: 'payout',
          attributes: {
            label: `Withdraw from user ${userId}`,
            amount:
              coinTicker === 'USDT'
                ? (Number(amount) + Number(feeInUSDT)).toString()
                : amount.toString(),
            address: address,
            fee_amount: calculatedFee,
            is_fee_included: canIncludeFee(coinTicker),
            tracking_id: `Withdraw from user ${userEmail}`,
            confirmations_needed: 1,
            travel_rule_info: {
              beneficiary: {
                beneficiaryPersons: [
                  {
                    naturalPerson: {
                      name: [
                        {
                          nameIdentifier: [
                            {
                              primaryIdentifier: 'John',
                              secondaryIdentifier: 'Doe',
                            },
                          ],
                        },
                      ],
                      geographicAddress: [
                        {
                          addressLine: ['Not specified'],
                          addressType: 'HOME',
                          country: 'US',
                        },
                      ],
                    },
                  },
                ],
              },
            },
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

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_COINSBUY_API_URL}/payout/`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token.access}`,
            'Content-Type': 'application/vnd.api+json',
            'idempotency-key': crypto.randomUUID(),
          },
          body: JSON.stringify(payoutData),
        },
      );

      console.log(payoutData);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData?.errors?.[0]?.detail || 'Failed to create payout',
        );
      }

      onSuccess();
      Notiflix.Notify.success('Запрос на вывод создан успешно');
      handleClose();
    } catch (error) {
      //console.error('Error creating withdrawal:', error);
      console.log(error);
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
              onChange={(e) => setAddress(e.target.value)}
              placeholder={`Введите адрес ${coinTicker}`}
              className='w-full'
            />

            <Input
              type='number'
              label={`Сумма ${coinTicker}`}
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder='Введите сумму'
              min='0'
              step='0.00000001'
              className='w-full'
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
                      {Number(amount) + Number(feeInUSDT)} {coinTicker}
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
            isLoading={isLoading}
            isDisabled={
              !amount ||
              !address ||
              (coinTicker === 'USDT'
                ? Number(amount) + Number(feeInUSDT) > balance
                : Number(amount) > balance)
            }
          >
            Создать запрос
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
