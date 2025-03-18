'use client';

import { useState, useEffect } from 'react';
import AlgorithmsList from '@/components/PageComponents/DashboardPage/Algorithms/AlgorithmsList'; // Путь к вашему компоненту
import AlgorithmModal from '@/components/PageComponents/DashboardPage/Algorithms/AlgorithmModal';
import { fetchAlgorithms } from '@/lib/data';

export default function AlgorithmsContainer() {
  const [algorithms, setAlgorithms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Функция для обновления списка алгоритмов
  const updateAlgorithms = async () => {
    try {
      setIsLoading(true);
      const data = await fetchAlgorithms();
      setAlgorithms(data);
    } catch (error) {
      console.error('Ошибка при обновлении алгоритмов', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    updateAlgorithms(); // Загружаем алгоритмы при монтировании компонента
  }, []);

  return (
    <div>
      <AlgorithmModal onAlgorithmAdded={updateAlgorithms} />
      <AlgorithmsList
        algorithms={algorithms}
        updateAlgorithms={updateAlgorithms} // Передаем функцию обновления
        isLoading={isLoading}
      />
    </div>
  );
}
