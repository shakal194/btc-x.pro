'use client';

import { useState } from 'react';
import { deleteEquipment } from '@/lib/data';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from '@heroui/react';
import { Notify } from 'notiflix';

interface DeleteEquipmentModalProps {
  equipmentName: string;
  equipmentId: number;
  onEquipmentDeleted: () => void;
  isDisabled: boolean;
}

export default function DeleteEquipmentModal({
  equipmentName,
  equipmentId,
  onEquipmentDeleted,
  isDisabled,
}: DeleteEquipmentModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteEquipment(equipmentId);
      Notify.success('Оборудование успешно удалено');
      onEquipmentDeleted();
      onClose();
    } catch (error) {
      console.error('Ошибка при удалении оборудования:', error);
      Notify.failure('Ошибка при удалении оборудования');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        size='lg'
        color='danger'
        onPress={onOpen}
        isDisabled={isDisabled}
        className={isDisabled ? 'cursor-not-allowed opacity-50' : ''}
      >
        Удалить
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        className='bg-slate-700 text-white'
      >
        <ModalContent>
          <ModalHeader>Удаление оборудования</ModalHeader>
          <ModalBody>
            {isDisabled ? (
              <p className='text-red-500'>
                Невозможно удалить оборудование, так как есть купленные доли
              </p>
            ) : (
              <>
                Вы уверены, что хотите удалить оборудование "{equipmentName}"?
                <br />
                Это действие нельзя отменить.
              </>
            )}
          </ModalBody>
          <ModalFooter>
            {!isDisabled && (
              <>
                <Button onPress={onClose}>Отмена</Button>
                <Button
                  color='danger'
                  onPress={handleDelete}
                  isLoading={isLoading}
                >
                  Удалить
                </Button>
              </>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
