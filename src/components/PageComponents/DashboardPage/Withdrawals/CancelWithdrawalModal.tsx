import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@heroui/react';

interface CancelWithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  withdrawal: {
    id: number;
    coinTicker: string;
    amount: string;
  };
}

export const CancelWithdrawalModal: React.FC<CancelWithdrawalModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  withdrawal,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size='md'
      className='bg-default-800'
    >
      <ModalContent>
        <ModalHeader className='text-white'>Отмена вывода</ModalHeader>
        <ModalBody>
          <div className='space-y-4'>
            <p className='text-white'>
              Точно ли вы хотите отменить этот вывод?
            </p>

            <div className='space-y-2'>
              <div className='flex justify-between text-white'>
                <span>Сумма вывода:</span>
                <span className='font-medium'>
                  {withdrawal.amount} {withdrawal.coinTicker}
                </span>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color='default' variant='bordered' onPress={onClose}>
            Нет, оставить
          </Button>
          <Button color='danger' onPress={onConfirm}>
            Да, отменить
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
