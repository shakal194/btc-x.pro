import Link from 'next/link';
import { FaceFrownIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
  return (
    <main className='flex h-full flex-col items-center justify-center gap-2 text-gray-200'>
      <FaceFrownIcon className='w-10' />
      <h2 className='text-xl font-semibold'>404 Not Found</h2>
      <p>Could not find this algorithm.</p>
      <Link
        href='/dashboard/algorithms'
        className='mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400'
      >
        Go Back
      </Link>
    </main>
  );
}
