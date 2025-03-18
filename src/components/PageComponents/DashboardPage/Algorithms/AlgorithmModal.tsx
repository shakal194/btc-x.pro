'use client';
import { useState, useTransition } from 'react';
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  Input,
  Button,
  useDisclosure,
  ModalFooter,
} from '@heroui/react';
import FullScreenSpinner from '@/components/ui/Spinner';
import { TrashIcon } from '@heroicons/react/24/outline';
import { insertAlgorithm } from '@/lib/data';
import Notiflix from 'notiflix';

export default function AlgorithmModal({
  onAlgorithmAdded,
}: {
  onAlgorithmAdded: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [algorithm, setAlgorithm] = useState(''); // Состояние для хранения алгоритма

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [tickerPairs, setTickerPairs] = useState([
    { ticker: '', coinsPerHashrate: '' },
  ]);
  const [errorCoinsPerHashrate, setErrorCoinsPerHashrate] = useState<
    string | null
  >(null);
  const [errorTicker, setErrorTicker] = useState<string | null>(null);
  const [errorAlgorithm, setErrorAlgorithm] = useState<string | null>(null);

  const handleCloseModal = () => {
    setAlgorithm('');
    setErrorAlgorithm('');
    setTickerPairs([{ ticker: '', coinsPerHashrate: '' }]);
    setErrorCoinsPerHashrate('');
    setErrorTicker('');
    onClose();
  };

  // Функция для валидации "Количество монет"
  const validateCoinsPerHashrate = (value: string) => {
    // Регулярное выражение для проверки числового значения с максимум 8 знаками после запятой
    const regex = /^\d+(\.\d{0,8})?$/;

    // Если значение не соответствует формату, возвращаем ошибку
    if (!regex.test(value)) {
      setErrorCoinsPerHashrate(
        'Цена должна быть числом с максимум 8 знаками после запятой',
      );
    } else {
      setErrorCoinsPerHashrate(null); // Если формат правильный, убираем ошибку
    }
  };

  // Обработка изменений в поле "Количество монет на единицу хешрейта"
  const handleCoinsPerHashrateChange = (index: number, value: string) => {
    const newPairs = [...tickerPairs];
    newPairs[index].coinsPerHashrate = value;
    setTickerPairs(newPairs);

    // Валидация при изменении
    validateCoinsPerHashrate(value);
  };

  const handleSaveAlgorithm = async () => {
    if (!algorithm || algorithm.trim().length < 3) {
      setErrorAlgorithm(
        'Название алгоритма должно содержать минимум 3 символа',
      );
      Notiflix.Notify.warning(
        'Название алгоритма должно содержать минимум 3 символа',
      );
      return;
    }

    const validPairs = tickerPairs.map((pair) => {
      if (!pair.ticker || pair.ticker.trim().length < 3) {
        setErrorTicker('Название тикера должно содержать минимум 3 символа');
        Notiflix.Notify.warning(
          'Название тикера должно содержать минимум 3 символа',
        );
        return false;
      }
      if (
        !pair.coinsPerHashrate ||
        isNaN(parseFloat(pair.coinsPerHashrate)) ||
        !/^\d+(\.\d{1,8})?$/.test(pair.coinsPerHashrate.toString())
      ) {
        setErrorCoinsPerHashrate(
          'Введите корректную цену с максимальной точностью до 8 знаков после запятой',
        );
        Notiflix.Notify.warning(
          'Введите корректную цену с максимальной точностью до 8 знаков после запятой',
        );
        return false;
      }
      return true;
    });

    if (validPairs.includes(false)) return;

    try {
      startTransition(async () => {
        setErrorAlgorithm(null);
        setAlgorithm('');
        setTickerPairs([{ ticker: '', coinsPerHashrate: '' }]);
        setErrorCoinsPerHashrate('');

        const coinsTickers = tickerPairs.map((pair) => ({
          name: pair.ticker,
          pricePerHashrate: parseFloat(pair.coinsPerHashrate),
        }));

        await insertAlgorithm(algorithm, coinsTickers);

        // Обновляем список алгоритмов после добавления
        onAlgorithmAdded();

        handleCloseModal();
        Notiflix.Notify.success('Алгоритм успешно добавлен');
      });
    } catch (error) {
      setErrorAlgorithm('Ошибка при сохранении данных');
      Notiflix.Notify.warning('Ошибка при сохранении данных');
    }
  };

  return (
    <section className='space-y-4'>
      <Button size='lg' className='my-4 bg-white' onPress={onOpen}>
        Добавить алгоритм
      </Button>
      <Modal
        isOpen={isOpen}
        size='2xl'
        onClose={handleCloseModal}
        className='bg-slate-700'
      >
        <ModalContent>
          <ModalHeader className='flex flex-col gap-1 text-white'>
            Добавить алгоритм
          </ModalHeader>
          <ModalBody className='space-y-4'>
            <Input
              size='lg'
              label='Название алгоритма'
              labelPlacement='inside'
              placeholder='Алгоритм'
              isRequired
              value={algorithm}
              isInvalid={!!errorAlgorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
            />
            {errorAlgorithm && (
              <div className='mt-4 text-secondary'>{errorAlgorithm}</div>
            )}
            {/* Тикеры и количество монет */}
            {tickerPairs.map((pair, index) => (
              <div key={index} className='flex items-center space-x-4'>
                <Input
                  size='lg'
                  label='Тикер монеты'
                  labelPlacement='inside'
                  placeholder='Ticker'
                  isRequired
                  value={pair.ticker}
                  isInvalid={!!errorTicker}
                  onChange={(e) => {
                    const newPairs = [...tickerPairs];
                    newPairs[index].ticker = e.target.value;
                    setTickerPairs(newPairs);
                  }}
                  className='w-[250px]'
                />
                <Input
                  size='lg'
                  label='Кол-тво монет на ед. хешрейта'
                  labelPlacement='inside'
                  placeholder='Coins'
                  isRequired
                  value={pair.coinsPerHashrate}
                  isInvalid={!!errorCoinsPerHashrate}
                  onChange={(e) =>
                    handleCoinsPerHashrateChange(index, e.target.value)
                  }
                />
                <Button
                  size='sm'
                  color='danger'
                  onPress={() =>
                    setTickerPairs(tickerPairs.filter((_, i) => i !== index))
                  }
                >
                  <TrashIcon className='h-5 w-5' />
                </Button>
              </div>
            ))}
            {errorTicker && (
              <div className='mt-4 text-secondary'>{errorTicker}</div>
            )}
            {errorCoinsPerHashrate && (
              <div className='mt-4 text-secondary'>{errorCoinsPerHashrate}</div>
            )}
            <ModalFooter>
              <Button color='danger' onPress={onClose}>
                Закрыть
              </Button>
              <Button
                color='success'
                onPress={() =>
                  setTickerPairs([
                    ...tickerPairs,
                    { ticker: '', coinsPerHashrate: '' },
                  ])
                }
              >
                Добавить тикер
              </Button>
              <Button color='success' onPress={handleSaveAlgorithm}>
                Сохранить
              </Button>
            </ModalFooter>
            {isPending && <FullScreenSpinner />}
          </ModalBody>
        </ModalContent>
      </Modal>
    </section>
  );
}
