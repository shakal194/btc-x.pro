import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className='relative z-50 text-white'>
      <div className='container mx-auto mt-4 flex w-[1340px] items-center justify-between rounded-lg border border-gray-400 px-5 py-3 backdrop-blur-md'>
        <nav className='flex items-center space-x-6'>
          <Link
            href='about-us'
            className='text-primary leading-[110%] transition hover:text-[#FD6B06] focus:text-[#FD6B06]'
            rel='noopener noreferrer'
          >
            Про нас
          </Link>
          <Link
            href='/airdrop'
            className='text-primary leading-[110%] transition hover:text-[#FD6B06] focus:text-[#FD6B06]'
            rel='noopener noreferrer'
          >
            Airdrop
          </Link>
          <Link
            href='/referral'
            className='text-primary leading-[110%] transition hover:text-[#FD6B06] focus:text-[#FD6B06]'
            rel='noopener noreferrer'
          >
            Реферальна програма
          </Link>
        </nav>

        {/* Логотип */}
        <div>
          <Link href='/' rel='noopener noreferrer'>
            <Image
              src='/logo_header.png' // Замените на путь к вашему логотипу
              alt='Logo'
              width={30}
              height={45}
              className='h-[45px] w-[30px] cursor-pointer object-contain'
            />
          </Link>
        </div>

        {/* Правый блок с кнопками */}
        <div className='flex items-center space-x-4'>
          <Link
            href='#'
            className='text-primary leading-[110%] transition hover:text-[#FD6B06] focus:text-[#FD6B06]'
          >
            Підтримка
          </Link>
          <div className='relative'>
            <button className='flex items-center text-primary leading-[110%] transition hover:text-[#FD6B06] focus:text-[#FD6B06]'>
              UA <span className='ml-1'>▼</span>
            </button>
            {/* Dropdown для языков (можно позже реализовать) */}
          </div>
          <Link
            href='https://onelink.to/js2s8h'
            target='_blank'
            rel='noopener noreferrer'
            className='rounded-full border px-5 py-3 text-primary font-bold leading-[110%] transition hover:border-[#FD6B06] hover:bg-[#FD6B06] hover:text-white focus:bg-[#FD6B06] focus:text-white'
          >
            Перейти в додаток
          </Link>
        </div>
      </div>
    </header>
  );
}
