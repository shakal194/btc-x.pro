import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import LocaleSwitcher from '@/components/ui/LocaleSwitcher';
import MobileMenu from '@/components/ui/MobileMenu';

export default function Header() {
  const t = useTranslations('header');

  return (
    <header className='relative z-50 text-white'>
      <div className='container mx-auto mt-4 px-4'>
        <div className='flex items-center justify-between space-x-2 rounded-lg border border-gray-400 px-5 py-[7px] backdrop-blur-md lg:py-[10px]'>
          <nav className='hidden items-center justify-between space-x-2 text-center lg:flex'>
            <Link
              href={`/about-us`}
              //href='/about-us'
              className='text-font16Leading110 leading-[110%] transition delay-200 hover:text-[#FD6B06] focus:text-[#FD6B06] xl:text-font18'
              rel='noopener noreferrer'
            >
              {t('aboutus')}
            </Link>
            <Link
              href={`/airdrop`}
              //href='/airdrop'
              className='text-font16Leading110 leading-[110%] transition delay-200 hover:text-[#FD6B06] focus:text-[#FD6B06] xl:text-font18'
              rel='noopener noreferrer'
            >
              {t('airdrop')}
            </Link>
            <Link
              href={`/referral`}
              //href='/referral'
              className='text-font16Leading110 leading-[110%] transition delay-200 hover:text-[#FD6B06] focus:text-[#FD6B06] xl:text-font18'
              rel='noopener noreferrer'
            >
              {t('referral')}
            </Link>
          </nav>

          {/* Логотип */}
          <div>
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

              <p className='ml-[5px] text-font16Leading110 font-semibold leading-[120%] lg:hidden xl:text-font18'>
                BTC-X
              </p>
            </Link>
          </div>

          <MobileMenu />

          {/* Правый блок с кнопками */}
          <div className='hidden items-center space-x-2 text-center lg:flex'>
            <Link
              href={`/promo`}
              className='text-font16Leading110 leading-[110%] transition delay-200 hover:text-[#FD6B06] focus:text-[#FD6B06] xl:text-font18'
            >
              {t('promo')}
            </Link>
            <Link
              href={`/cloud-mining`}
              className='text-font16Leading110 leading-[110%] transition delay-200 hover:text-[#FD6B06] focus:text-[#FD6B06] xl:text-font18'
            >
              {t('cloudMining')}
            </Link>
            <Link
              href={`/support`}
              className='text-font16Leading110 leading-[110%] transition delay-200 hover:text-[#FD6B06] focus:text-[#FD6B06] xl:text-font18'
            >
              <Image
                src='/support.png'
                width={25}
                height={25}
                alt='Support icon'
              />
            </Link>
            <LocaleSwitcher />
            <Link
              href='https://onelink.to/js2s8h'
              target='_blank'
              rel='noopener noreferrer'
              className='rounded-full border px-5 py-3 text-center text-font16Leading110 font-bold leading-[110%] transition delay-200 hover:border-[#FD6B06] hover:bg-[#FD6B06] hover:text-white focus:bg-[#FD6B06] focus:text-white xl:text-font18'
            >
              {t('app')}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
