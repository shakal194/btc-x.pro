'use client';

import { Button } from '@heroui/react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-black/90'>
      <div className='rounded-lg bg-gray-800 p-8 text-center'>
        <h2 className='mb-4 text-2xl font-bold text-white'>
          История начислений майнинга не найдена
        </h2>
        <p className='mb-6 text-gray-400'>
          Запрошенная история начислений майнинга не существует или была удалена
        </p>
        <Button
          as={Link}
          href='/dashboard/users'
          color='secondary'
          variant='shadow'
          className='font-medium'
        >
          Вернуться к списку пользователей
        </Button>
      </div>
    </div>
  );
}
