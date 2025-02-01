import Image from 'next/image';
import StoreButtons from '@/components/ui/StoreButtons';

export default function HeroSection() {
  return (
    <section className='bg-black py-[30px] xl:py-[100px]'>
      <div className='container relative mx-auto px-4'>
        <div className='flex'>
          <div className='z-20'>
            <div className='w-[300px] md:w-[500px] xl:w-[1013px]'>
              <h1 className='text-font30Leading110 xl:text-font75Leading110'>
                ЗАРОБЛЯЙТЕ{' '}
                <span className='bg-gradient-to-r from-[#FFC996] via-[#FD6B06] to-[#963706] bg-clip-text text-transparent'>
                  ДО 55%
                </span>{' '}
                З КОЖНОГО ЗАПРОШЕНОГО КОРИСТУВАЧА
              </h1>
            </div>
            <div className='mt-[62px] lg:mt-[100px] lg:w-[435px]'>
              <p className='w-[238px] text-[13px] font-semibold leading-[130%] text-white/40 md:w-[338px] md:text-primary lg:w-full lg:max-w-3xl lg:text-white'>
                Ми пропонуємо вам унікальну можливість отримувати{' '}
                <span className='text-white'>до 55% від прибутку</span>, який ми
                отримуємо за угоди запрошених вами користувачів
              </p>
              <div className='my-6 hidden border-t opacity-[33%] lg:block'></div>
              <div className='mt-[20px] grid grid-cols-2 gap-2 md:gap-4 lg:mt-0 lg:gap-8'>
                <StoreButtons theme='dark' />
              </div>
            </div>
          </div>
          <div className='pointer-events-none absolute left-1/2 top-1/4 z-10 w-full -translate-x-1/2 -translate-y-1/4 lg:top-[15%] xl:top-1/4'>
            <Image
              src='/hero_refferal_mobile.png'
              alt='Phone'
              width={693}
              height={699}
              className='relative h-[699px] w-[693px] md:w-full lg:hidden'
            />
            <Image
              src='/hero_refferal.png'
              alt='Phone'
              width={2158}
              height={1282}
              className='relative hidden lg:block'
            />
          </div>
        </div>
      </div>
    </section>
  );
}
