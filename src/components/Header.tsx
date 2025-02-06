import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import LocaleSwitcher from '@/components/ui/LocaleSwitcher';
import MobileMenu from '@/components/ui/MobileMenu';

export default function Header({ locale }: { locale: string }) {
  const t = useTranslations('header');

  return (
    <header className='relative z-50 text-white'>
      <div className='container mx-auto mt-4 px-4'>
        <div className='flex items-center justify-between rounded-lg border border-gray-400 px-5 py-[7px] backdrop-blur-md lg:py-[10px]'>
          <nav className='hidden items-center space-x-6 lg:flex'>
            <Link
              href={`/${locale}/about-us`}
              //href='/about-us'
              className='text-primary leading-[110%] transition hover:text-[#FD6B06] focus:text-[#FD6B06]'
              rel='noopener noreferrer'
            >
              {t('aboutus')}
            </Link>
            <Link
              href={`/${locale}/airdrop`}
              //href='/airdrop'
              className='text-primary leading-[110%] transition hover:text-[#FD6B06] focus:text-[#FD6B06]'
              rel='noopener noreferrer'
            >
              {t('airdrop')}
            </Link>
            <Link
              href={`/${locale}/referral`}
              //href='/referral'
              className='text-primary leading-[110%] transition hover:text-[#FD6B06] focus:text-[#FD6B06]'
              rel='noopener noreferrer'
            >
              {t('referral')}
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

          <MobileMenu locale={locale} />

          {/* Правый блок с кнопками */}
          <div className='hidden items-center space-x-4 lg:flex'>
            <Link
              href={`/${locale}/promo`}
              className='text-primary leading-[110%] transition hover:text-[#FD6B06] focus:text-[#FD6B06]'
            >
              {t('promo')}
            </Link>
            <Link
              href='#'
              className='text-primary leading-[110%] transition hover:text-[#FD6B06] focus:text-[#FD6B06]'
            >
              {t('support')}
            </Link>
            <LocaleSwitcher />
            <Link
              href='https://onelink.to/js2s8h'
              target='_blank'
              rel='noopener noreferrer'
              className='rounded-full border px-5 py-3 text-primary font-bold leading-[110%] transition hover:border-[#FD6B06] hover:bg-[#FD6B06] hover:text-white focus:bg-[#FD6B06] focus:text-white'
            >
              {t('app')}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
