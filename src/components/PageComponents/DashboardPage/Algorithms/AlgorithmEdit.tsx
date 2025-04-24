'use client';

import { useEffect, useState } from 'react';
import {
  Input,
  Button,
  Breadcrumbs,
  BreadcrumbItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@heroui/react';
import {
  fetchAlgorithmByUuid,
  updateAlgorithmName,
  addTickerToAlgorithm,
  deleteTickerFromAlgorithm,
  updateTickerPricePerHashrate,
  deleteAlgorithm,
} from '@/lib/data';
import Notiflix from 'notiflix';
import FullScreenSpinner from '@/components/ui/Spinner';
import { TrashIcon, PlusIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function AlgorithmEdit({
  algorithmUuid,
}: {
  algorithmUuid: string;
}) {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [algorithm, setAlgorithm] = useState<any>(null);
  const [newName, setNewName] = useState('');
  const [newTicker, setNewTicker] = useState('');
  const [newTickerPrice, setNewTickerPrice] = useState('');
  const [editedTickers, setEditedTickers] = useState<
    Record<string, { name: string; price: string }>
  >({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchAlgorithmByUuid(algorithmUuid);
        if (data) {
          setAlgorithm(data);
          setNewName(data.name);
          // Инициализируем состояние для каждого тикера
          if (data.coinTickers) {
            const initialEdits = data.coinTickers.reduce(
              (acc: any, ticker: any) => {
                acc[ticker.name] = {
                  name: ticker.name,
                  price: Number(ticker.pricePerHashrate).toFixed(8),
                };
                return acc;
              },
              {},
            );
            setEditedTickers(initialEdits);
          }
        }
      } catch (error) {
        console.error('Error fetching algorithm data:', error);
        Notiflix.Notify.failure('Ошибка при загрузке данных алгоритма');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [algorithmUuid]);

  const handleUpdateName = async () => {
    try {
      setIsLoading(true);
      await updateAlgorithmName(algorithmUuid, newName);
      Notiflix.Notify.success('Название алгоритма обновлено');
    } catch (error) {
      console.error('Error updating algorithm name:', error);
      Notiflix.Notify.failure('Ошибка при обновлении названия алгоритма');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTicker = async () => {
    if (!newTicker || !newTickerPrice) {
      Notiflix.Notify.warning('Заполните все поля');
      return;
    }

    const price = parseFloat(newTickerPrice);
    if (isNaN(price) || price <= 0) {
      Notiflix.Notify.warning('Введите корректное количество монет');
      return;
    }

    try {
      setIsLoading(true);
      await addTickerToAlgorithm(algorithmUuid, newTicker, price);
      const updatedData = await fetchAlgorithmByUuid(algorithmUuid);
      setAlgorithm(updatedData);
      setNewTicker('');
      setNewTickerPrice('');
      Notiflix.Notify.success('Монета добавлена');
    } catch (error) {
      console.error('Error adding ticker:', error);
      Notiflix.Notify.failure('Ошибка при добавлении монеты');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTicker = async (tickerName: string) => {
    try {
      setIsLoading(true);
      await deleteTickerFromAlgorithm(algorithmUuid, tickerName);
      const updatedData = await fetchAlgorithmByUuid(algorithmUuid);
      setAlgorithm(updatedData);
      Notiflix.Notify.success('Монета удалена');
    } catch (error) {
      console.error('Error deleting ticker:', error);
      Notiflix.Notify.failure('Ошибка при удалении монеты');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTickerPrice = async (oldTickerName: string) => {
    const editedTicker = editedTickers[oldTickerName];

    // Проверяем существование editedTicker
    if (!editedTicker) {
      Notiflix.Notify.failure('Ошибка: данные тикера не найдены');
      return;
    }

    const price = parseFloat(editedTicker.price);

    if (isNaN(price) || price <= 0) {
      Notiflix.Notify.warning('Введите корректное количество монет');
      return;
    }

    try {
      setIsLoading(true);

      // Если имя тикера было изменено
      if (oldTickerName !== editedTicker.name) {
        try {
          // Проверяем, что новое имя не пустое
          if (!editedTicker.name.trim()) {
            throw new Error('Название монеты не может быть пустым');
          }

          // Сначала добавляем новый тикер
          await addTickerToAlgorithm(algorithmUuid, editedTicker.name, price);

          // Затем удаляем старый тикер
          await deleteTickerFromAlgorithm(algorithmUuid, oldTickerName);

          Notiflix.Notify.success('Название и цена монеты обновлены');
        } catch (error) {
          // Если произошла ошибка, пытаемся откатить изменения
          console.error('Error updating ticker name:', error);
          try {
            // Пытаемся удалить новый тикер, если он был добавлен
            await deleteTickerFromAlgorithm(algorithmUuid, editedTicker.name);
          } catch {
            // Игнорируем ошибку отката
          }
          throw new Error(
            error instanceof Error
              ? error.message
              : 'Не удалось обновить название монеты',
          );
        }
      } else {
        // Если изменилась только цена
        await updateTickerPricePerHashrate(algorithmUuid, oldTickerName, price);
        Notiflix.Notify.success('Цена монеты обновлена');
      }

      // Обновляем данные алгоритма
      const updatedData = await fetchAlgorithmByUuid(algorithmUuid);
      setAlgorithm(updatedData);

      // Обновляем состояние редактирования
      const newEdits = { ...editedTickers };
      newEdits[editedTicker.name] = {
        name: editedTicker.name,
        price: price.toString(),
      };
      if (oldTickerName !== editedTicker.name) {
        delete newEdits[oldTickerName];
      }
      setEditedTickers(newEdits);
    } catch (error) {
      console.error('Error updating ticker:', error);
      Notiflix.Notify.failure(
        error instanceof Error
          ? error.message
          : 'Ошибка при обновлении данных монеты',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAlgorithm = async () => {
    try {
      setIsLoading(true);
      await deleteAlgorithm(algorithmUuid);
      Notiflix.Notify.success('Алгоритм успешно удален');
      router.push('/dashboard/algorithms');
    } catch (error) {
      console.error('Error deleting algorithm:', error);
      Notiflix.Notify.failure('Ошибка при удалении алгоритма');
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  const isTickerChanged = (
    originalTicker: any,
    editedTicker: { name: string; price: string },
  ) => {
    return (
      originalTicker.name !== editedTicker.name ||
      originalTicker.pricePerHashrate.toString() !== editedTicker.price
    );
  };

  if (!algorithm) {
    return <FullScreenSpinner />;
  }

  return (
    <div className='min-h-screen w-full space-y-4 bg-black/90 p-4'>
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
              onPress={handleDeleteAlgorithm}
              isDisabled={isLoading}
            >
              {isLoading ? <FullScreenSpinner /> : 'Удалить'}
            </Button>
            <Button color='danger' onPress={onClose} isDisabled={isLoading}>
              Отмена
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <div className='rounded-lg bg-gray-800 p-4'>
        {isLoading ? (
          <div className='flex h-[200px] items-center justify-center'>
            <FullScreenSpinner />
          </div>
        ) : (
          <>
            <Breadcrumbs>
              <BreadcrumbItem
                href='/dashboard/algorithms'
                className='text-gray-300'
              >
                Алгоритмы
              </BreadcrumbItem>
              <BreadcrumbItem isCurrent className='text-gray-200'>
                Редактировать
              </BreadcrumbItem>
            </Breadcrumbs>

            <div className='space-y-6'>
              <div className='mt-4'>
                <Input
                  label='Название алгоритма'
                  labelPlacement='inside'
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className='w-full md:w-[400px]'
                />
                <div className='mt-2 flex gap-2'>
                  <Button color='success' size='lg' onPress={handleUpdateName}>
                    Обновить название
                  </Button>
                  <Button color='danger' size='lg' onPress={onOpen}>
                    Удалить алгоритм
                  </Button>
                </div>
              </div>

              <div>
                <h2 className='mb-4 text-xl font-bold text-white'>Монеты</h2>
                {algorithm?.coinTickers.map((ticker: any, index: number) => (
                  <div key={index} className='mb-4 flex items-center gap-4'>
                    <div className='flex gap-4'>
                      <Input
                        label='Название монеты'
                        labelPlacement='inside'
                        value={editedTickers[ticker.name]?.name || ''}
                        onChange={(e) => {
                          const newEdits = { ...editedTickers };
                          newEdits[ticker.name] = {
                            ...newEdits[ticker.name],
                            name: e.target.value,
                          };
                          setEditedTickers(newEdits);
                        }}
                        className='w-full md:w-[200px]'
                      />
                      <Input
                        label='Количество монет'
                        labelPlacement='inside'
                        value={editedTickers[ticker.name]?.price || ''}
                        onChange={(e) => {
                          const newEdits = { ...editedTickers };
                          const value = e.target.value.replace(',', '.');
                          newEdits[ticker.name] = {
                            ...newEdits[ticker.name],
                            price: Number(value).toFixed(8),
                          };
                          setEditedTickers(newEdits);
                        }}
                        className='w-full md:w-[200px]'
                      />
                    </div>
                    <div className='flex gap-2'>
                      <Button
                        color='success'
                        size='lg'
                        isDisabled={
                          !isTickerChanged(ticker, editedTickers[ticker.name])
                        }
                        onPress={() => handleUpdateTickerPrice(ticker.name)}
                      >
                        <CheckIcon className='h-5 w-5' />
                      </Button>
                      <Button
                        color='danger'
                        size='lg'
                        onPress={() => handleDeleteTicker(ticker.name)}
                      >
                        <TrashIcon className='h-5 w-5' />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <h3 className='mb-2 text-lg font-bold text-white'>
                  Добавить новую монету
                </h3>
                <div className='flex items-center gap-4'>
                  <Input
                    label='Название монеты'
                    labelPlacement='inside'
                    value={newTicker}
                    onChange={(e) => setNewTicker(e.target.value)}
                    className='w-full md:w-[200px]'
                  />
                  <Input
                    label='Количество монет в сутки'
                    labelPlacement='inside'
                    type='number'
                    value={newTickerPrice}
                    onChange={(e) => setNewTickerPrice(e.target.value)}
                    className='w-full md:w-[200px]'
                  />
                  <Button color='success' size='lg' onPress={handleAddTicker}>
                    <PlusIcon className='h-5 w-5' />
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
