import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className='bg-black text-white'>
      <div className='container mx-auto mt-4 flex w-[1340px] items-center justify-between rounded-lg border border-gray-400 px-5 py-3 backdrop-blur-md'>
        <nav className='flex items-center space-x-6'>
          <Link
            href='#'
            className='text-primary leading-[110%] transition hover:text-white'
            rel='noopener noreferrer'
          >
            Про нас
          </Link>
          <Link
            href='#'
            className='text-primary leading-[110%] transition hover:text-white'
            rel='noopener noreferrer'
          >
            Airdrop
          </Link>
          <Link
            href='#'
            className='text-primary leading-[110%] transition hover:text-white'
            rel='noopener noreferrer'
          >
            Реферальна програма
          </Link>
        </nav>

        {/* Логотип */}
        <div>
          <Link href='/' rel='noopener noreferrer'>
            <Image
              src='/Logo.png' // Замените на путь к вашему логотипу
              alt='Logo'
              width={30}
              height={45}
              className='object-contain'
            />
          </Link>
        </div>

        {/* Правый блок с кнопками */}
        <div className='flex items-center space-x-4'>
          <Link
            href='#'
            className='text-primary leading-[110%] transition hover:text-white'
          >
            Підтримка
          </Link>
          <div className='relative'>
            <button className='flex items-center text-primary leading-[110%] transition hover:text-white'>
              UA <span className='ml-1'>▼</span>
            </button>
            {/* Dropdown для языков (можно позже реализовать) */}
          </div>
          <Link
            href='https://onelink.to/js2s8h'
            target='_blank'
            rel='noopener noreferrer'
            className='rounded-full border px-5 py-3 text-primary font-bold leading-[110%] transition'
          >
            Перейти в додаток
          </Link>
        </div>
      </div>
    </header>
  );
}
