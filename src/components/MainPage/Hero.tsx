import Image from 'next/image';
import StoreButtons from '@/components/ui/StoreButtons';

export default function HeroSection() {
  return (
    <section className='bg-black py-[25px] lg:py-[100px]'>
      <div className='container relative mx-auto px-4'>
        <div className='flex gap-2'>
          <div className='z-20'>
            <div className='lg:w-[716px]'>
              <h1 className='text-font30Leading110 md:text-font50Leading110 lg:text-font75Leading110'>
                ТОРГУЙТЕ БЕЗ КОМІСІЇ ПРОТЯГОМ УСЬОГО{' '}
                <span className='bg-gradient-to-r from-[#FFC996] via-[#FD6B06] to-[#963706] bg-clip-text text-transparent'>
                  2025 РОКУ
                </span>
              </h1>
            </div>
            <div className='mt-[20px] lg:mt-[186px] lg:w-[435px] lg:rounded-lg lg:bg-gradient-to-r lg:from-[#553300] lg:to-[#FE9900] lg:p-[1px]'>
              <div className='lg:bg-black lg:px-[25px] lg:py-6 xl:rounded-lg'>
                <p className='my-[25px] text-[13px] font-medium leading-[130%] opacity-[30%] md:text-font16Leading110 lg:mt-0 lg:max-w-3xl lg:text-primary lg:font-semibold lg:opacity-100'>
                  Завантажте додаток BTC-X і отримайте доступ до торгівлі прямо
                  зараз.
                </p>
                <div className='lg:border-t lg:opacity-[33%] xl:my-6'></div>
                <div className='grid grid-cols-2 gap-4'>
                  <StoreButtons theme='dark' />
                </div>
              </div>
            </div>
          </div>
          <div className='pointer-events-none absolute -top-[60%] left-1/2 z-10 w-full -translate-x-1/2 md:hidden'>
            <Image
              src='/hero_main_page_mobile.png'
              alt='Hero image'
              width={640}
              height={910}
              className='w-[640px]'
            />
          </div>
          <div className='pointer-events-none absolute left-1/2 z-10 hidden w-full -translate-x-1/2 md:-top-[150%] md:block lg:hidden'>
            <Image
              src='/hero_main_page_tablet.png'
              alt='Hero image'
              width={1280}
              height={1612}
              className='w-[1280px]'
            />
          </div>
          <div className='pointer-events-none absolute -left-1/2 z-10 hidden translate-x-1/2 lg:top-[-190px] lg:block xl:left-3/4 xl:-translate-x-2/3'>
            <Image
              src='/hero_main_page.png'
              alt='Hero image'
              width={1268}
              height={951}
              className='relative w-[1268px] max-w-none'
            />
          </div>
        </div>
      </div>
    </section>
  );
}
