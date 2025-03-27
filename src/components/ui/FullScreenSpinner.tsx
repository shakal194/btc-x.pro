export function FullScreenSpinner() {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent'></div>
    </div>
  );
}
