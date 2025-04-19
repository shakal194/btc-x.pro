'use client';

import { Button } from '@heroui/react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-black/90'>
      <div className='rounded-lg bg-gray-800 p-8 text-center'>
        <h2 className='mb-4 text-2xl font-bold text-white'>
          История транзакций не найдена
        </h2>
        <p className='mb-6 text-gray-400'>
          Запрошенная история транзакций оборудования не существует или была
          удалена
        </p>
        <Button
          as={Link}
          href='/dashboard'
          color='secondary'
          variant='shadow'
          className='font-medium'
        >
          Вернуться назад
        </Button>
      </div>
    </div>
  );
}
