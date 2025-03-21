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
  useDisclosure,
} from '@heroui/react';
import { updateEquipment, fetchEquipmentById } from '@/lib/data';
import FullScreenSpinner from '@/components/ui/Spinner';
import Notiflix from 'notiflix';

export default function EditEquipmentModal({
  uuid,
  onEquipmentUpd,
}: {
  uuid: string;
  onEquipmentUpd: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState('');
  const [purchasePrice, setPurchasePrice] = useState<number>();
  const [salePrice, setSalePrice] = useState<number>();
  const [error, setError] = useState('');

  // Получаем данные оборудования по ID
  useEffect(() => {
    const getEquipmentById = async () => {
      try {
        const res = await fetchEquipmentById(uuid); // Получаем данные устройства по id
        const data = res[0];
        if (data) {
          setName(data.name);
          setPurchasePrice(data.purchasePrice);
          setSalePrice(data.salePrice);
        }
      } catch (error) {
        console.error('Ошибка при получении данных оборудования', error);
      }
    };

    if (uuid) {
      getEquipmentById(); // Запрашиваем данные устройства, если id существует
    }
  }, [uuid]);

  // Функция для очистки инпутов при закрытии модального окна
  const handleCloseModal = () => {
    setError('');
    onClose();
  };

  const handleUpdEquipment = async () => {
    if (!name || !purchasePrice || !salePrice) {
      setError('Все поля обязательны для заполнения');
      Notiflix.Notify.warning('Пожалуйста, заполните все поля');
      return;
    }

    const purchasePriceNumber = parseInt(purchasePrice.toString());
    const salePriceNumber = parseInt(salePrice.toString());

    // Валидация числовых значений
    if (isNaN(purchasePriceNumber) || isNaN(salePriceNumber)) {
      setError('Пожалуйста, введите корректные числовые значения');
      Notiflix.Notify.warning('Некорректные числовые значения');
      return;
    }

    try {
      setError(''); // Очистить ошибку
      // Вставка данных об оборудовании

      startTransition(async () => {
        await updateEquipment(uuid, {
          name: name,
          purchasePrice: purchasePriceNumber,
          salePrice: salePriceNumber,
        });

        // Очистить форму после успешного добавления
        handleCloseModal();

        onEquipmentUpd();

        Notiflix.Notify.success('Оборудование успешно добавлено');
      });
    } catch (error) {
      console.error('Ошибка при добавлении оборудования:', error);
      Notiflix.Notify.warning('Ошибка при добавлении оборудования');
    }
  };

  /*const algorithm = algorithms.find(
    (algo) => algo.id === equipment.algorithm_id,
  );*/

  return (
    <>
      <Button size='lg' className='bg-white' onPress={onOpen}>
        Изменить оборудование
      </Button>
      <Modal
        isOpen={isOpen}
        size='xl'
        placement='center'
        onClose={handleCloseModal}
        className='bg-slate-700'
      >
        <ModalContent>
          <ModalHeader className='flex flex-col gap-1 text-white'>
            Изменить оборудование
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
                value={purchasePrice?.toString()}
                onChange={(e) => setPurchasePrice(parseInt(e.target.value))}
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
                value={salePrice?.toString()}
                onChange={(e) => setSalePrice(parseInt(e.target.value))}
                className='w-full sm:w-[350px] md:w-[400px]'
              />

              {error && <div className='mt-4 text-red-500'>{error}</div>}
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color='danger' onPress={handleCloseModal}>
              Отменить
            </Button>
            <Button color='success' onPress={handleUpdEquipment}>
              Обновить
            </Button>
            {isPending && <FullScreenSpinner />}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
