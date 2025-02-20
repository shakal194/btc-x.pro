'use client';

import { useState, useEffect } from 'react';

export default function TradeVolumeTimer() {
  const initialVolume = 7293654; // Начальный объем
  const maxVolume = 1000000000; // Максимальный объем (1 миллиард)
  const intervalTime = 50; // Интервал обновления (50 миллисекунд)

  const [volume, setVolume] = useState(initialVolume); // Начальный объем
  const [elapsedTime, setElapsedTime] = useState(0); // Время, прошедшее с начальной даты
  const [targetVolume, setTargetVolume] = useState(0); // Целевой объем
  const [step, setStep] = useState(94329); // Начальный шаг увеличения объема (ускоренный)
  const [isCompleted, setIsCompleted] = useState(false); // Флаг завершения прокрутки
  const [isStarted, setIsStarted] = useState(false); // Флаг, чтобы начать прокрутку по скроллу
  const [scrollPosition, setScrollPosition] = useState(0); // Позиция прокрутки страницы

  const [isClient, setIsClient] = useState(false); // Добавляем флаг для проверки клиента

  useEffect(() => {
    setIsClient(true); // Устанавливаем флаг в true, когда компонент монтируется на клиенте
  }, []);

  // Обработчик события прокрутки
  const handleScroll = () => {
    const element = document.getElementById('volume-timer'); // Идентификатор элемента для отслеживания прокрутки
    if (element) {
      const rect = element.getBoundingClientRect();
      if (rect.top <= window.innerHeight && rect.bottom >= 0) {
        // Когда элемент виден в окне браузера
        setIsStarted(true);
      }
    }
    setScrollPosition(window.scrollY); // Записываем текущую позицию прокрутки
  };

  // Запускаем таймер с нужным шагом
  useEffect(() => {
    if (isClient && isStarted) {
      // Проверка, что компонент отрендерен на клиенте
      const startDate = new Date('2024-11-01'); // Начальная дата

      const updateVolume = () => {
        const now = new Date();
        const timeDifference = Math.floor(
          (now.getTime() - startDate.getTime()) / 1000,
        ); // Получаем прошедшие секунды

        // Устанавливаем целевой объем, равный начальному объему + количество секунд * шаг
        const newTargetVolume = initialVolume + timeDifference;

        // Ограничиваем максимальным объемом
        setTargetVolume(Math.min(newTargetVolume, maxVolume));

        // Рассчитываем разницу между целевым объемом и текущим
        const volumeDifference = targetVolume - volume;

        // Плавное замедление, если разница между целевым и текущим объемом уменьшается
        let newStep = step;

        // Чем меньше разница, тем меньше шаг
        if (volumeDifference < 200000) {
          newStep = Math.round(Math.max(1, step * 0.75)); // Меньше разница - меньше шаг
        }

        // Обновляем шаг
        setStep(newStep);

        // Обновляем объем
        if (volume < targetVolume) {
          const increment = Math.min(newStep, targetVolume - volume);
          setVolume((prevVolume) => prevVolume + increment);
        }

        if (volume >= targetVolume) {
          setIsCompleted(true);
        }
      };

      const interval = setInterval(updateVolume, intervalTime);

      return () => clearInterval(interval); // Очистка интервала при размонтировании компонента
    }
  }, [isClient, isStarted, volume, targetVolume, step]);

  // Используем useEffect для отслеживания скроллинга
  useEffect(() => {
    if (isClient) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [isClient]);

  if (!isClient) return null; // Если компонент еще не отрендерен на клиенте, ничего не рендерим

  return <h2>{volume.toLocaleString()}</h2>;
}
