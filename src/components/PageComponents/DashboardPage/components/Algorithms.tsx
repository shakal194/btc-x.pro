'use client';
import { useState, useTransition, useEffect, useMemo } from 'react';
import {
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@heroui/react';
import { CloudArrowDownIcon, TrashIcon } from '@heroicons/react/24/outline';
import {
  insertElectricityPrice,
  fetchElectricityPrice,
  insertAlgorithm,
  fetchAlgorithms,
  deleteTickerFromAlgorithm,
  updateTickerPricePerHashrate,
} from '@/lib/data'; // Импортируем функцию из data.ts
import FullScreenSpinner from '@/components/ui/Spinner';
import Notiflix from 'notiflix';

export default function Algorithms() {
  const [isLoading, setIsLoading] = useState<boolean>(false); // Флаг загрузки
  const [price, setPrice] = useState(''); // Состояние для хранения введённой цены
  const [tickerPairs, setTickerPairs] = useState([
    { ticker: '', coinsPerHashrate: '' },
  ]);
  const [errorPrice, setErrorPrice] = useState<string | null>(null); // Для ошибки валидации
  const [updCoinsPerHashrate, setUpdCoinsPerHashrate] = useState(''); // Состояние для хранения введённой цены
  const [errorAlgorithm, setErrorAlgorithm] = useState<string | null>(null); // Для ошибки валидации
  const [errorTicker, setErrorTicker] = useState<string | null>(null); // Для ошибки валидации
  const [errorCoinsPerHashrate, setErrorCoinsPerHashrate] = useState<
    string | null
  >(null); // Для ошибки валидации
  const [lastPrice, setLastPrice] = useState<any>(null);
  const [isPending, startTransition] = useTransition();
  const [algorithmsFetch, setAlgorithmsFetch] = useState<any[]>([]);
  const [algorithm, setAlgorithm] = useState(''); // Состояние для хранения алгоритма
  const [ticker, setTicker] = useState(''); // Состояние для хранения алгоритма

  const [coinPrices, setCoinPrices] = useState<{ [key: string]: string }>({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const algorithmErrors: string[] = [];
  const tickerErrors: string[] = [];

  if (algorithm.length < 3) {
    algorithmErrors.push(
      'Название алгоритма должно содержать минимум 3 символа',
    );
  }

  if (ticker.length < 3) {
    tickerErrors.push('Название тикера должно содержать минимум 3 символа');
  }

  const handleOpen = () => {
    onOpen();
  };

  useEffect(() => {
    const getLastPrice = async () => {
      try {
        const data = await fetchElectricityPrice(); // Получаем данные с сервера
        setLastPrice(data); // Устанавливаем данные в состояние
      } catch (error) {
        console.error('Ошибка при получении данных о цене', error);
      }
    };

    getLastPrice();
  }, []);

  useEffect(() => {
    const getAlgorithms = async () => {
      setIsLoading(true);
      try {
        const data = await fetchAlgorithms(); // Получаем данные с сервера

        setAlgorithmsFetch(data);
        return data;
      } catch (error) {
        console.error('Ошибка при получении данных по алгоритмам', error);
      } finally {
        setIsLoading(false);
      }
    };

    getAlgorithms();
  }, []);

  // Функция для валидации и отправки данных
  const handleSavePrice = async () => {
    // Проверка, что введённое значение является числом
    const priceNumber = parseFloat(price);

    // Проверяем, что значение валидное число и соответствует ограничениям
    if (
      isNaN(priceNumber) ||
      priceNumber <= 0 ||
      !/^\d+(\.\d{1,8})?$/.test(price)
    ) {
      setErrorPrice(
        'Введите корректную цену с максимальной точностью до 8 знаков после запятой',
      );
      return;
    }

    // Отправляем данные на сервер
    try {
      startTransition(async () => {
        setErrorPrice(null); // Очистить ошибку
        setPrice(''); // Очистить инпут после успешной отправки

        // Вставляем данные в таблицу через серверную функцию
        await insertElectricityPrice(priceNumber);
        const updatedPrice = await fetchElectricityPrice(); // Получаем обновленную последнюю цену
        setLastPrice(updatedPrice);

        Notiflix.Notify.success('Цена успешно изменена');
      });
    } catch (error) {
      setErrorPrice('Ошибка при сохранении данных');
      Notiflix.Notify.warning('Ошибка при сохранении данных');
    }
  };

  // Функция для удаления тикера
  const handleDeleteTicker = async (
    tickerName: string,
    algorithmName: string,
  ) => {
    try {
      startTransition(async () => {
        await deleteTickerFromAlgorithm(algorithmName, tickerName);

        const updatedAlgorithms = await fetchAlgorithms(); // Fetch updated list of algorithms
        setAlgorithmsFetch(updatedAlgorithms);

        Notiflix.Notify.success('Тикер успешно удален');
      });
    } catch (error) {
      Notiflix.Notify.warning('Ошибка при удалении тикера');
    }
  };

  const handleInputChangePrice = (tickerName: string, value: string) => {
    setCoinPrices((prev) => ({
      ...prev,
      [tickerName]: value,
    }));
  };

  const handleUpdatePrice = async (
    algorithmName: string,
    tickerName: string,
  ) => {
    const newPriceNumber = parseFloat(coinPrices[tickerName]);

    if (
      Number.isNaN(newPriceNumber) ||
      newPriceNumber <= 0 ||
      !/^\d+(\.\d{1,8})?$/.test(newPriceNumber.toString())
    ) {
      // Если значение не число или меньше или равно 0
      setUpdCoinsPerHashrate(
        'Введите корректную цену с максимальной точностью до 8 знаков после запятой',
      );
      Notiflix.Notify.warning('Введите корректное количество монет');
      return;
    }

    try {
      startTransition(async () => {
        await updateTickerPricePerHashrate(
          algorithmName,
          tickerName,
          newPriceNumber,
        );

        const updatedAlgorithms = await fetchAlgorithms(); // Fetch updated list of algorithms
        setAlgorithmsFetch(updatedAlgorithms);
        setCoinPrices({});

        Notiflix.Notify.success('Количество монет обновлено');
      });
    } catch (error) {
      Notiflix.Notify.warning('Количество монет не обновлено');
    }
  };

  // Функция для валидации и отправки алгоритма
  const addPair = () => {
    setTickerPairs([...tickerPairs, { ticker: '', coinsPerHashrate: '' }]);
  };

  // Function to handle changes to ticker and coinsPerHashrate
  const handleInputChange = (index: number, field: string, value: string) => {
    const newPairs = [...tickerPairs];
    newPairs[index] = { ...newPairs[index], [field]: value };
    setTickerPairs(newPairs);
  };

  // Handle deleting a ticker pair
  const handleDeletePair = (index: number) => {
    const newPairs = tickerPairs.filter((_, i) => i !== index);
    setTickerPairs(newPairs);
  };

  // Function to validate and save the algorithm
  const handleSaveAlgorithm = async () => {
    // Validate algorithm name
    if (!algorithm || algorithm.trim().length < 3) {
      setErrorAlgorithm(
        'Название алгоритма должно содержать минимум 3 символа',
      );
      Notiflix.Notify.warning(
        'Название алгоритма должно содержать минимум 3 символа',
      );
      return;
    }

    // Validate each ticker and coinsPerHashrate pair
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

    if (validPairs.includes(false)) return; // If any pair is invalid, stop execution

    // Send data to the server
    try {
      startTransition(async () => {
        setErrorAlgorithm(null); // Очистка ошибок
        setAlgorithm(''); // Очистка введенного алгоритма
        setTickerPairs([{ ticker: '', coinsPerHashrate: '' }]);
        setErrorCoinsPerHashrate(''); // Очистка ошибки для coinsPerHashrate

        const coinsTickers = tickerPairs
          .map((pair) => {
            const coinsPerHashrate = pair.coinsPerHashrate;

            // Проверяем количество знаков после запятой
            const decimalPlaces = coinsPerHashrate.split('.')[1]?.length || 0;

            // Проверка на корректность числа
            if (decimalPlaces > 8) {
              setErrorCoinsPerHashrate(
                'Количество монет не должно содержать более 8 знаков после запятой',
              );
              Notiflix.Notify.warning(
                'Введите корректное количество монет (до 8 знаков после запятой)',
              );
              return null; // Возвращаем null, чтобы фильтровать в следующем шаге
            }

            // Если все в порядке, возвращаем объект с тикером и ценой
            return {
              name: pair.ticker,
              pricePerHashrate: parseFloat(coinsPerHashrate),
            };
          })
          .filter((coin) => coin !== null); // Фильтруем все null значения (ошибочные тикеры)

        // Если после фильтрации нет валидных тикеров, прерываем выполнение
        if (coinsTickers.length === 0) {
          return;
        }

        // Вставляем данные в базу
        await insertAlgorithm(algorithm, coinsTickers);

        // Получаем обновленный список алгоритмов
        const updatedAlgorithms = await fetchAlgorithms();
        setAlgorithmsFetch(updatedAlgorithms);

        // Сброс состояния
        setAlgorithm('');
        setTickerPairs([{ ticker: '', coinsPerHashrate: '' }]);
        setTicker('');
        setErrorCoinsPerHashrate('');

        onClose(); // Закрыть модальное окно
        Notiflix.Notify.success('Алгоритм успешно добавлен');
      });
    } catch (error) {
      setErrorAlgorithm('Ошибка при сохранении данных');
      Notiflix.Notify.warning('Ошибка при сохранении данных');
    }
  };

  const handleCloseModal = () => {
    // Очистка инпутов при закрытии модального окна
    setAlgorithm('');
    setTickerPairs([{ ticker: '', coinsPerHashrate: '' }]);
    setTicker('');
    setErrorCoinsPerHashrate('');
    setErrorTicker('');
    onClose();
  };

  return (
    <section className='space-y-4'>
      <div className='border-y-1 border-secondary py-8'>
        <div className='text-white'>
          {lastPrice ? (
            <div>
              <p>Последняя цена: {lastPrice.pricePerKWh} $</p>
              <p>
                Дата обновления:{' '}
                {new Date(lastPrice.recordDate).toLocaleString()}
              </p>
            </div>
          ) : (
            <p>Загрузка последней цены...</p>
          )}
        </div>
        <div>
          <div className='flex w-[500px] items-center justify-between'>
            <Input
              size='lg'
              label='Цена за 1кВт, $'
              labelPlacement='outside-left'
              placeholder='0.00'
              className='w-[300px]'
              value={price}
              onChange={(e) => setPrice(e.target.value.replace(',', '.'))}
              startContent={
                <div className='pointer-events-none flex items-center'>
                  <span className='text-small text-default-400'>$</span>
                </div>
              }
            />
            <Button size='lg' className='bg-white' onPress={handleSavePrice}>
              <CloudArrowDownIcon className='h-5 w-5' />
            </Button>
            {isPending && <FullScreenSpinner />}
          </div>
          {errorPrice && <div className='mt-4 text-red-500'>{errorPrice}</div>}
        </div>
      </div>
      <div className='text-lg text-white'>
        <ul className='space-y-4'>
          {isLoading ? (
            <p>Загрузка алгоритмов...</p>
          ) : algorithmsFetch.length > 0 ? (
            algorithmsFetch.map((algorithm, index) => (
              <li key={index} className='border-b-1 border-secondary'>
                <div className='text-center'>
                  Алгоритм - <b>{algorithm.name}</b>
                </div>
                <div>
                  <b>
                    {algorithm.coinTickers.map((ticker: any, index: number) => (
                      <div
                        key={index}
                        className='mb-4 flex items-center justify-between space-y-2 py-2'
                      >
                        <div>
                          <p>Монета - {ticker.name}</p>
                          <p className='mb-2'>
                            Кол-во монет в сутки на ед. хешрейта -{' '}
                            {ticker.pricePerHashrate}
                          </p>
                        </div>
                        <div>
                          <div className='flex w-[400px] items-center justify-between'>
                            <Input
                              size='lg'
                              label='Количество монет'
                              labelPlacement='inside'
                              placeholder='0.00'
                              className='w-[200px]'
                              value={coinPrices[ticker.name] || ''}
                              onChange={(e) =>
                                handleInputChangePrice(
                                  ticker.name,
                                  e.target.value.replace(',', '.'),
                                )
                              }
                              startContent={
                                <div className='pointer-events-none flex items-center'>
                                  <span className='text-small text-default-400'>
                                    $
                                  </span>
                                </div>
                              }
                            />
                            <Button
                              size='lg'
                              className='bg-white'
                              onPress={() =>
                                handleUpdatePrice(algorithm.name, ticker.name)
                              }
                            >
                              <CloudArrowDownIcon className='h-5 w-5' />
                            </Button>

                            {isPending && <FullScreenSpinner />}
                            <Button
                              size='lg'
                              className='bg-white'
                              onPress={() =>
                                handleDeleteTicker(ticker.name, algorithm.name)
                              }
                            >
                              <TrashIcon className='h-5 w-5' />
                            </Button>
                            {isPending && <FullScreenSpinner />}
                          </div>
                          {updCoinsPerHashrate && (
                            <div className='mt-4 text-red-500'>
                              {updCoinsPerHashrate}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </b>
                </div>
              </li>
            ))
          ) : (
            <p>Алгоритмы не найдены</p>
          )}
        </ul>
      </div>
      <Button size='lg' className='bg-white' onPress={() => handleOpen()}>
        Добавить алгоритм
      </Button>
      <Modal
        isOpen={isOpen}
        size='xl'
        onClose={handleCloseModal}
        className='bg-slate-700'
      >
        <ModalContent>
          <ModalHeader className='flex flex-col gap-1 text-white'>
            Добавить алгоритм
          </ModalHeader>
          <ModalBody>
            {/* Input for algorithm name */}
            <Input
              size='lg'
              label='Название алгоритма'
              labelPlacement='inside'
              placeholder='Алгоритм'
              isRequired
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              className='w-[400px]'
            />
            {errorAlgorithm && (
              <div className='mt-4 text-secondary'>{errorAlgorithm}</div>
            )}

            {/* Dynamic ticker and coinsPerHashrate input pairs */}
            {tickerPairs.map((pair, index) => (
              <div key={index} className='flex items-center space-x-4'>
                <Input
                  size='lg'
                  label='Тикер монеты'
                  labelPlacement='inside'
                  placeholder='Ticker'
                  isRequired
                  value={pair.ticker}
                  onChange={(e) =>
                    handleInputChange(index, 'ticker', e.target.value)
                  }
                  className='w-[200px]'
                />
                <Input
                  size='lg'
                  label='Количество монет на единицу хешрейта'
                  labelPlacement='inside'
                  placeholder='Coins'
                  isRequired
                  value={pair.coinsPerHashrate}
                  onChange={(e) =>
                    handleInputChange(index, 'coinsPerHashrate', e.target.value)
                  }
                  className='w-[200px]'
                />
                <Button
                  size='sm'
                  className='bg-red-500'
                  onPress={() => handleDeletePair(index)}
                >
                  <TrashIcon className='h-5 w-5' />
                </Button>
              </div>
            ))}
            {errorCoinsPerHashrate && (
              <div className='mt-4 text-secondary'>{errorCoinsPerHashrate}</div>
            )}
            {/* Button to add more pairs */}
            <Button size='sm' className='bg-green-500' onClick={addPair}>
              Добавить еще пару тикер / количество монет
            </Button>

            {/* Submit button */}
            <Button color='success' onPress={handleSaveAlgorithm}>
              Добавить
            </Button>
            {isPending && <FullScreenSpinner />}
          </ModalBody>
        </ModalContent>
      </Modal>
    </section>
  );
}
