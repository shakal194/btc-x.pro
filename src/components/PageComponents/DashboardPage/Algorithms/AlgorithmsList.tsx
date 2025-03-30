'use client';
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@heroui/react';
import { deleteAlgorithm } from '@/lib/data';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import FullScreenSpinner from '@/components/ui/Spinner';
import Notiflix from 'notiflix';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AlgorithmsList({
  algorithms,
  updateAlgorithms,
  isLoading,
}: {
  algorithms: any[];
  updateAlgorithms: () => void;
  isLoading: boolean;
}) {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedAlgorithmUuid, setSelectedAlgorithmUuid] = useState<
    string | null
  >(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (uuid: string) => {
    setSelectedAlgorithmUuid(uuid);
    onOpen();
  };

  const handleDeleteConfirm = async () => {
    if (!selectedAlgorithmUuid) return;

    try {
      setIsDeleting(true);
      await deleteAlgorithm(selectedAlgorithmUuid);
      await updateAlgorithms();
      Notiflix.Notify.success('Алгоритм успешно удален');
    } catch (error) {
      console.error('Error deleting algorithm:', error);
      Notiflix.Notify.failure('Ошибка при удалении алгоритма');
    } finally {
      setIsDeleting(false);
      onClose();
      setSelectedAlgorithmUuid(null);
    }
  };

  const handleEditAlgorithm = (uuid: string) => {
    router.push(`/dashboard/algorithms/${uuid}/edit`);
  };

  return (
    <section className='min-h-screen w-full space-y-4 bg-black/90 p-4'>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size='sm'
        className='bg-slate-700'
      >
        <ModalContent>
          <ModalHeader className='flex flex-col gap-1 text-white'>
            Подтверждение удаления
          </ModalHeader>
          <ModalBody>
            <p className='text-white'>
              Вы уверены, что хотите удалить этот алгоритм?
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              color='success'
              onPress={handleDeleteConfirm}
              isDisabled={isDeleting}
            >
              {isDeleting ? <FullScreenSpinner /> : 'Удалить'}
            </Button>
            <Button color='danger' onPress={onClose} isDisabled={isDeleting}>
              Отмена
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {isLoading && <FullScreenSpinner />}
      <div className='rounded-lg bg-gray-800 p-4'>
        <h1 className='mb-6 text-2xl font-bold text-white'>Алгоритмы</h1>
        <div className='space-y-4'>
          {algorithms.length > 0 ? (
            algorithms.map((algorithm, index) => (
              <div
                key={index}
                className='rounded-lg border border-gray-700 bg-gray-800 p-4'
              >
                <div className='flex items-center justify-between'>
                  <h2 className='text-xl font-bold text-white'>
                    {algorithm.name}
                  </h2>
                  <div className='flex gap-2'>
                    <Button
                      color='secondary'
                      size='lg'
                      onPress={() => handleEditAlgorithm(algorithm.uuid)}
                    >
                      <PencilIcon className='h-5 w-5' />
                    </Button>
                    <Button
                      color='danger'
                      size='lg'
                      onPress={() => handleDeleteClick(algorithm.uuid)}
                    >
                      <TrashIcon className='h-5 w-5' />
                    </Button>
                  </div>
                </div>
                <div className='mt-4 space-y-2'>
                  {algorithm.coinTickers.map((ticker: any, index: number) => (
                    <div
                      key={index}
                      className='flex items-center justify-between rounded bg-gray-700 p-2'
                    >
                      <span className='text-white'>{ticker.name}</span>
                      <span className='text-gray-300'>
                        {ticker.pricePerHashrate.toFixed(8)} монет/день
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className='text-center text-gray-400'>Алгоритмы не найдены</p>
          )}
        </div>
      </div>
    </section>
  );
}
