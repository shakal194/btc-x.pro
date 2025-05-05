'use client';

import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
} from '@heroui/react';
import { getWalletId } from '@/lib/constants';
import { getWalletBalance, getAccessToken } from '@/lib/coinsbuy';

interface ConfirmWithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  withdrawal: {
    id: number;
    coinTicker: string;
    amount: string;
  };
}

export const ConfirmWithdrawalModal: React.FC<ConfirmWithdrawalModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  withdrawal,
}) => {
  const [walletBalance, setWalletBalance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWalletBalance = async () => {
      if (!isOpen) return;

      setIsLoading(true);
      setError(null);

      try {
        const token = await getAccessToken();
        const walletId = getWalletId(withdrawal.coinTicker);
        const balance = await getWalletBalance(token, walletId);
        setWalletBalance(balance);
      } catch (err) {
        setError('Не удалось получить баланс кошелька');
        console.error('Error fetching wallet balance:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWalletBalance();
  }, [isOpen, withdrawal.coinTicker]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size='md'
      className='bg-default-800'
    >
      <ModalContent>
        <ModalHeader className='text-white'>Подтверждение вывода</ModalHeader>
        <ModalBody>
          <div className='space-y-4'>
            <p className='text-white'>
              Точно ли вы хотите подтвердить этот вывод?
            </p>

            <div className='space-y-2'>
              <div className='flex justify-between text-white'>
                <span>Сумма вывода:</span>
                <span className='font-medium'>
                  {withdrawal.amount} {withdrawal.coinTicker}
                </span>
              </div>

              <div className='flex justify-between text-white'>
                <span>Баланс кошелька:</span>
                {isLoading ? (
                  <Spinner size='sm' color='secondary' />
                ) : error ? (
                  <span className='text-danger'>{error}</span>
                ) : (
                  <span className='font-medium'>
                    {walletBalance} {withdrawal.coinTicker}
                  </span>
                )}
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color='danger' variant='light' onPress={onClose}>
            Отмена
          </Button>
          <Button
            color='success'
            onPress={onConfirm}
            isDisabled={isLoading || !!error}
          >
            Подтвердить
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
