import { useState, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Snippet,
} from '@heroui/react';
import { getOrCreateDepositAddress } from '@/lib/data';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { getCoinNetwork, getMinDeposit } from '@/lib/constants';
import { useTranslations } from 'next-intl';
import { formatCoinTicker } from '@/lib/utils';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  coinTicker: string;
  userId: number;
  userEmail: string;
}

export default function DepositModal({
  isOpen,
  onClose,
  coinTicker,
  userId,
  userEmail,
}: DepositModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [depositAddress, setDepositAddress] = useState<string>('');
  const network = getCoinNetwork(coinTicker);
  const minDeposit = getMinDeposit(coinTicker);
  const t = useTranslations(
    'cloudMiningPage.dashboard.userContent.depositModal',
  );

  useEffect(() => {
    if (isOpen && userId) {
      setIsLoading(true);
      getOrCreateDepositAddress(userId, userEmail, coinTicker)
        .then((result) => {
          setDepositAddress(result.depositAddress);
          setIsLoading(false);
        })
        .catch((error: Error) => {
          console.error(t('errorGettingDepositAddress'), error);
          setIsLoading(false);
        });
    }
  }, [isOpen, userId, userEmail, coinTicker, t]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size='xl' className='bg-gray-800'>
      <ModalContent>
        <ModalHeader className='text-white'>
          {t('depositBalance')} {formatCoinTicker(coinTicker)}
        </ModalHeader>
        <ModalBody>
          <div className='space-y-4'>
            <p className='text-white'>
              {t('depositBalance')} {formatCoinTicker(coinTicker)}{' '}
              {t('onTheFollowingAddress')}:
            </p>
            {isLoading ? (
              <div className='flex justify-center'>
                <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-white'></div>
              </div>
            ) : (
              <Snippet
                symbol=''
                variant='bordered'
                className='bg-gray-700'
                classNames={{
                  base: 'border-gray-600 w-full',
                  pre: 'text-white',
                  copyButton: 'text-gray-400 hover:text-gray-300',
                }}
              >
                {depositAddress}
              </Snippet>
            )}
            <div className='mt-4 space-y-2 text-sm text-gray-400'>
              <div className='flex items-center gap-2'>
                <ExclamationCircleIcon className='h-5 w-5 text-secondary' />
                <p className='text-secondary'>{t('important')}</p>
              </div>
              <ul className='list-inside list-disc space-y-1 pl-4'>
                <li>{t('sendOnly')}</li>
                <li>{t('sendOnlyInTheNetwork')}</li>
                <li>
                  {t('minimumDeposit')}: {minDeposit} {coinTicker}
                </li>
                <li>{t('afterTheTransactionIsConfirmedInTheNetwork')}</li>
              </ul>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color='danger' variant='light' onPress={onClose}>
            {t('close')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
