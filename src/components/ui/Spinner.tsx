'use client';

import { Spinner } from '@heroui/react';
import { useTranslations } from 'next-intl';

export default function FullScreenSpinner() {
  const t = useTranslations('promo');

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-lg'>
      <Spinner
        size='lg'
        color='primary'
        labelColor='foreground'
        label={t('spinner_text')}
      />
    </div>
  );
}
