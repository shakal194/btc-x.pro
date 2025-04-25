'use client';
import { useState, useTransition, useEffect } from 'react';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Button,
  Form,
  Input,
  Select,
  SelectItem,
  useDisclosure,
} from '@heroui/react';
import { insertEquipment, fetchAlgorithms } from '@/lib/data';
import FullScreenSpinner from '@/components/ui/Spinner';
import Notiflix from 'notiflix';

export default function AddEquipmentModal({
  onEquipmentAdded,
}: {
  onEquipmentAdded: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [hashrateUnit, setHashrateUnit] = useState('');
  const [algorithm_id, setAlgorithm_id] = useState('');
  const [name, setName] = useState('');
  const [hashrate, setHashrate] = useState('');
  const [power, setPower] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [shareCount, setShareCount] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [error, setError] = useState('');

  const [algorithms, setAlgorithms] = useState<any[]>([]); // Состояние для хранения алгоритмов

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

  const hashrateUnitArray = [
    { key: 'Th', label: 'Th' },
    { key: 'Mh', label: 'Mh' },
    { key: 'Gh', label: 'Gh' },
  ];

  const handleAlgorithmSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedAlgorithmId = e.target.value;
    setAlgorithm_id(selectedAlgorithmId);

    // Находим выбранный алгоритм и устанавливаем его единицу измерения
    const selectedAlgorithm = algorithms.find(
      (alg) => alg.id.toString() === selectedAlgorithmId,
    );
    if (selectedAlgorithm) {
      setHashrateUnit(selectedAlgorithm.hashrate_unit);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhoto(e.target.files[0]);
    }
  };

  // Функция для очистки инпутов при закрытии модального окна
  const handleCloseModal = () => {
    setName('');
    setAlgorithm_id('');
    setHashrate('');
    setPower('');
    setPurchasePrice('');
    setSalePrice('');
    setShareCount('');
    setError('');
    onClose();
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

          onEquipmentAdded();
          Notiflix.Notify.success('Оборудование успешно добавлено');
        });
      };
    } catch (error) {
      console.error('Ошибка при добавлении оборудования:', error);
      Notiflix.Notify.warning('Ошибка при добавлении оборудования');
    }
  };

  return (
    <>
      <Button size='lg' onPress={onOpen}>
        Добавить оборудование
      </Button>
      <Modal
        isOpen={isOpen}
        size='xl'
        placement='center'
        scrollBehavior='outside'
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
                size='sm'
                label='Название оборудования'
                labelPlacement='inside'
                placeholder='Название'
                isRequired
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='w-full sm:w-[350px] md:w-[400px]'
              />
              <Select
                label='Алгоритм'
                size='sm'
                value={algorithm_id}
                onChange={handleAlgorithmSelectChange}
              >
                {algorithms.map((algorithm) => (
                  <SelectItem
                    key={algorithm.id}
                    textValue={
                      algorithm.name +
                      ' ' +
                      '(' +
                      algorithm.hashrate_unit +
                      '/s)'
                    }
                  >
                    {algorithm.name} ({algorithm.hashrate_unit}/s)
                  </SelectItem>
                ))}
              </Select>
              <Input
                size='sm'
                label='Единица измерения хешрейта'
                labelPlacement='inside'
                value={`${hashrateUnit}/s`}
                isDisabled
                className='w-full sm:w-[350px] md:w-[400px]'
              />
              <Input
                size='sm'
                label='Хешрейт'
                labelPlacement='inside'
                placeholder='Хешрейт'
                type='number'
                isRequired
                value={hashrate}
                onChange={(e) => setHashrate(e.target.value)}
                className='w-full sm:w-[350px] md:w-[400px]'
              />
              <Input
                size='sm'
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
                className='w-full sm:w-[350px] md:w-[400px]'
              />
              <Input
                size='sm'
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
                className='w-full sm:w-[350px] md:w-[400px]'
              />
              <Input
                size='sm'
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
                className='w-full sm:w-[350px] md:w-[400px]'
              />
              <Input
                size='sm'
                label='Количество долей'
                labelPlacement='inside'
                placeholder='Количество долей'
                type='number'
                isRequired
                value={shareCount}
                onChange={(e) => setShareCount(e.target.value)}
                className='w-full sm:w-[350px] md:w-[400px]'
              />
              <Input type='file' onChange={handleFileChange} accept='image/*' />
              {error && <div className='mt-4 text-danger'>{error}</div>}
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
    </>
  );
}
