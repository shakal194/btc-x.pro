import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function OurPlatformSection() {
  const t = useTranslations('mainPage.ourPlatform');

  return (
    <section className='relative z-10 mt-[653px] md:mt-[1120px] lg:mt-0 lg:py-[100px]'>
      <div className='container mx-auto px-4 text-center'>
        <p className='text-primary leading-[125%] tracking-tight lg:text-[40px]'>
          {t('title')}
        </p>
        <p className='flex flex-col items-center text-primary leading-[125%] tracking-tight lg:flex-row lg:justify-center lg:text-[40px]'>
          {t('subtitle')}
          <span className='relative ml-4 mt-2 flex items-center justify-start lg:mb-0'>
            <Image
              src='/binance_icon.png'
              alt='Binance'
              width={45}
              height={45}
              className='relative z-10 -ml-2'
            />
            <Image
              src='/okx_icon.png'
              alt='OKX'
              width={45}
              height={45}
              className='relative z-20 -ml-3'
            />
            <Image
              src='/coinbase_icon.png'
              alt='Coinbase'
              width={45}
              height={45}
              className='relative z-30 -ml-3'
            />
          </span>
        </p>
      </div>
    </section>
  );
}
