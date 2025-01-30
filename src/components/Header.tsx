import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className='relative z-50 text-white'>
      <div className='container mx-auto mt-4 px-4'>
        <div className='flex items-center justify-between rounded-lg border border-gray-400 px-5 py-3 backdrop-blur-md'>
          <nav className='hidden items-center space-x-6 lg:flex'>
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
          <div className=''>
            <Link
              href='/'
              rel='noopener noreferrer'
              className='flex items-center lg:block'
            >
              <Image
                src='/logo_header.png' // Замените на путь к вашему логотипу
                alt='Logo'
                width={30}
                height={45}
                className='h-[26px] w-[17px] cursor-pointer object-contain lg:h-[45px] lg:w-[30px]'
              />

              <p className='ml-[5px] text-primary font-semibold leading-[120%] lg:hidden'>
                BTC-X
              </p>
            </Link>
          </div>

          {/* Правый блок с кнопками */}
          <div className='hidden items-center space-x-4 lg:flex'>
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
      </div>
    </header>
  );
}
