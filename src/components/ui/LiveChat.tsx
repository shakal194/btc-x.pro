'use client';

import { LiveChatWidget, EventHandlerPayload } from '@livechat/widget-react';
import { useState, useEffect } from 'react';

export default function LiveChat() {
  const [visibility, setVisibility] = useState<'minimized' | 'maximized'>(
    'maximized',
  );

  // Обработчик изменения размера окна
  const handleResize = () => {
    if (window.innerWidth < 1024) {
      setVisibility('minimized');
    } else {
      setVisibility('maximized');
    }
  };

  // Используем useEffect для добавления слушателя событий изменения размера окна
  useEffect(() => {
    // Устанавливаем начальную видимость
    handleResize();

    // Добавляем слушатель изменения размера
    window.addEventListener('resize', handleResize);

    // Убираем слушатель при размонтировании компонента
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <LiveChatWidget
      license='18749046'
      visibility={visibility} // Динамически меняем visibility
    />
  );
}
