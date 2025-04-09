import { Spinner } from '@heroui/react';

export const FullScreenSpinner = () => {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <Spinner size='lg' color='success' />
    </div>
  );
};
