'use client';
import { useState, useTransition, useEffect } from 'react';
import {
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Select,
  SelectItem,
  ModalFooter,
  useDisclosure,
  Form,
} from '@heroui/react';
import { insertEquipment, fetchEquipments, fetchAlgorithms } from '@/lib/data'; // Импортируем функцию для добавления оборудования
import FullScreenSpinner from '@/components/ui/Spinner';
import Notiflix from 'notiflix';
import Image from 'next/image';

export default function Equipments() {
  const [isLoading, setIsLoading] = useState<boolean>(false); // Флаг загрузки
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState('');
  const [algorithm_id, setAlgorithm] = useState('');
  const [hashrateUnit, setHashrateUnit] = useState('');
  const [hashrate, setHashrate] = useState('');
  const [power, setPower] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [shareCount, setShareCount] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const [algorithms, setAlgorithms] = useState<any[]>([]); // Состояние для хранения алгоритмов

  const [equipmentsFetch, setEquipmentsFetch] = useState<any[]>([]);

  const hashrateUnitArray = [
    { key: 'Th', label: 'Th' },
    { key: 'Mh', label: 'Mh' },
    { key: 'Gh', label: 'Gh' },
  ];

  const handlehashrateUnitSelectChange = (e: any) => {
    setHashrateUnit(e.target.value);
  };

  //Получаем список всего оборудования
  useEffect(() => {
    const getEquipments = async () => {
      setIsLoading(true);
      try {
        const data = await fetchEquipments(); // Получаем данные с сервера

        setEquipmentsFetch(data);
        return data;
      } catch (error) {
        console.error('Ошибка при получении данных по алгоритмам', error);
      } finally {
        setIsLoading(false);
      }
    };

    getEquipments();
  }, []);

  //Получаем список всех алгоритмов
  useEffect(() => {
    const getAlgorithms = async () => {
      try {
        const data = await fetchAlgorithms();
        setAlgorithms(data); // Сохраняем алгоритмы в состояние
      } catch (error) {
        console.error('Ошибка при получении алгоритмов', error);
      }
    };

    getAlgorithms();
  }, []);

  const handleAlgorithmSelectChange = (e: any) => {
    setAlgorithm(e.target.value);
  };

  // Функция для очистки инпутов при закрытии модального окна
  const handleCloseModal = () => {
    setName('');
    setAlgorithm('');
    setHashrate('');
    setPower('');
    setPurchasePrice('');
    setSalePrice('');
    setShareCount('');
    setError('');
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleSaveEquipment = async () => {
    if (
      !name ||
      !algorithm_id ||
      !hashrate ||
      !hashrateUnit ||
      !power ||
      !purchasePrice ||
      !salePrice ||
      !shareCount
    ) {
      setError('Все поля обязательны для заполнения');
      Notiflix.Notify.warning('Пожалуйста, заполните все поля');
      return;
    }

    if (!photo) {
      alert('Please select a photo');
      return;
    }

    const algorithmIdNumber = parseInt(algorithm_id);
    const hashrateNumber = parseInt(hashrate);
    const powerNumber = parseFloat(power);
    const purchasePriceNumber = parseInt(purchasePrice);
    const salePriceNumber = parseInt(salePrice);
    const shareCountNumber = parseInt(shareCount, 10);

    // Валидация числовых значений
    if (
      isNaN(algorithmIdNumber) ||
      isNaN(hashrateNumber) ||
      isNaN(powerNumber) ||
      isNaN(purchasePriceNumber) ||
      isNaN(salePriceNumber) ||
      isNaN(shareCountNumber)
    ) {
      setError('Пожалуйста, введите корректные числовые значения');
      Notiflix.Notify.warning('Некорректные числовые значения');
      return;
    }

    try {
      // Ожидаем завершения асинхронной операции FileReader
      const reader = new FileReader();

      reader.readAsDataURL(photo); // Начинаем читать файл

      // Обработчик загрузки файла
      reader.onloadend = async () => {
        const base64Photo = reader.result as string;

        setError(''); // Очистить ошибку
        // Вставка данных об оборудовании

        startTransition(async () => {
          await insertEquipment({
            name: name,
            algorithm_id: algorithmIdNumber,
            hashrate_unit: hashrateUnit,
            hashrate: hashrateNumber,
            power: powerNumber,
            purchasePrice: purchasePriceNumber,
            salePrice: salePriceNumber,
            shareCount: shareCountNumber,
            photoUrl: base64Photo,
          });

          // Очистить форму после успешного добавления
          handleCloseModal();
          const updateEquipments = await fetchEquipments();
          setEquipmentsFetch(updateEquipments);

          Notiflix.Notify.success('Оборудование успешно добавлено');
        });
      };
    } catch (error) {
      console.error('Ошибка при добавлении оборудования:', error);
      Notiflix.Notify.warning('Ошибка при добавлении оборудования');
    }
  };

  return (
    <section className='space-y-4'>
      <div className='text-lg text-white'>
        <ul className='space-y-4'>
          {isLoading ? (
            <p>Загрузка оборудования...</p>
          ) : equipmentsFetch.length > 0 ? (
            equipmentsFetch.map((equipment, index) => {
              // Находим алгоритм по ID
              const algorithm = algorithms.find(
                (algo) => algo.id === equipment.algorithm_id,
              );

              return (
                <li key={index} className='border-b-1 border-secondary'>
                  <div className='flex items-center'>
                    <div className='mr-4'>
                      {equipment.photoUrl && (
                        <Image
                          src={equipment.photoUrl.replace(/^public/, '')}
                          alt={equipment.name}
                          width={300}
                          height={300}
                          className='h-[300px] w-[300px]'
                        />
                      )}
                    </div>
                    <div>
                      <p>
                        <b>Наименование:</b> {equipment.name}
                      </p>
                      <p>
                        <b>Алгоритм:</b>{' '}
                        {algorithm ? algorithm.name : 'Не найден'}
                      </p>
                      <p>
                        <b>Мощность:</b> {equipment.power}
                      </p>
                      <p>
                        <b>Доли:</b> {equipment.shareCount}
                      </p>
                      <p>
                        <b>Цена покупки:</b> {equipment.purchasePrice}
                      </p>
                      <p>
                        <b>Цена продажи:</b> {equipment.salePrice}
                      </p>
                      <p>
                        <b>Устройств в работе:</b> 11/5
                      </p>
                      <p>
                        <b>Доход в сутки одного устройства:</b> 0,00010500 BTC
                      </p>
                    </div>
                  </div>
                </li>
              );
            })
          ) : (
            <p>Оборудование не найдено</p>
          )}
        </ul>
      </div>
      <Button size='lg' className='bg-white' onPress={onOpen}>
        Добавить оборудование
      </Button>
      <Modal
        isOpen={isOpen}
        size='3xl'
        onClose={handleCloseModal}
        className='bg-slate-700'
      >
        <ModalContent>
          <ModalHeader className='flex flex-col gap-1 text-white'>
            Добавить оборудование
          </ModalHeader>
          <ModalBody className='mx-auto'>
            <Form>
              <Input
                size='lg'
                label='Название оборудования'
                labelPlacement='inside'
                placeholder='Название'
                isRequired
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='w-[400px]'
              />
              <Select
                label='Алгоритм'
                value={algorithm_id}
                onChange={handleAlgorithmSelectChange}
              >
                {algorithms.map((algorithm) => (
                  <SelectItem key={algorithm.id}>{algorithm.name}</SelectItem>
                ))}
              </Select>
              <Input
                size='lg'
                label='Мощность'
                labelPlacement='inside'
                placeholder='Мощность'
                type='number'
                endContent={
                  <div className='pointer-events-none flex items-center'>
                    <span className='text-small text-default-400'>кВт</span>
                  </div>
                }
                isRequired
                value={power}
                onChange={(e) => setPower(e.target.value)}
                className='w-[400px]'
              />
              <Input
                size='lg'
                label='Хешрейт'
                labelPlacement='inside'
                placeholder='Хешрейт'
                type='number'
                isRequired
                value={hashrate}
                onChange={(e) => setHashrate(e.target.value)}
                className='w-[400px]'
              />
              <Select
                label='Единица измерения'
                value={hashrateUnit}
                onChange={handlehashrateUnitSelectChange}
              >
                {hashrateUnitArray.map((unit) => (
                  <SelectItem key={unit.key}>{unit.label}</SelectItem>
                ))}
              </Select>
              <Input
                size='lg'
                label='Цена покупки'
                labelPlacement='inside'
                placeholder='Цена покупки'
                type='number'
                isRequired
                startContent={
                  <div className='pointer-events-none flex items-center'>
                    <span className='text-small text-default-400'>$</span>
                  </div>
                }
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
                className='w-[400px]'
              />
              <Input
                size='lg'
                label='Цена продажи'
                labelPlacement='inside'
                placeholder='Цена продажи'
                startContent={
                  <div className='pointer-events-none flex items-center'>
                    <span className='text-small text-default-400'>$</span>
                  </div>
                }
                type='number'
                isRequired
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                className='w-[400px]'
              />
              <Input
                size='lg'
                label='Количество долей'
                labelPlacement='inside'
                placeholder='Количество долей'
                type='number'
                isRequired
                value={shareCount}
                onChange={(e) => setShareCount(e.target.value)}
                className='w-[400px]'
              />
              <Input type='file' onChange={handleFileChange} accept='image/*' />
              {error && <div className='mt-4 text-red-500'>{error}</div>}
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color='danger' onPress={handleCloseModal}>
              Отменить
            </Button>
            <Button color='success' onPress={handleSaveEquipment}>
              Добавить
            </Button>
            {isPending && <FullScreenSpinner />}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </section>
  );
}
