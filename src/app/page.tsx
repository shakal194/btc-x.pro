import Image from 'next/image';
import Link from 'next/link';
import PlatformStats from '@/components/PlatformStats';
import FiveSteps from '@/components/FiveSteps';
import AboutUs from '@/components/AboutUs';
import FAQ from '@/components/FAQ';

export default function Home() {
  return (
    <main className='bg-black text-white'>
      {/* Hero Section */}
      <section className='bg-black py-[60px]'>
        <div className='container relative mx-auto w-[1340px] px-4'>
          <div className='flex gap-2'>
            <div className='z-20'>
              <div className='w-[716px]'>
                <h1 className='text-[75px] font-bold leading-[110%] tracking-tight'>
                  ТОРГУЙТЕ БЕЗ КОМІСІЇ ПРОТЯГОМ УСЬОГО{' '}
                  <span className='bg-gradient-to-r from-[#FFC996] via-[#FD6B06] to-[#963706] bg-clip-text text-transparent'>
                    2025 РОКУ
                  </span>
                </h1>
              </div>
              <div className='relative mt-[186px] w-[435px] rounded-lg bg-gradient-to-r from-[#553300] to-[#FE9900] p-[1px]'>
                <div className='rounded-lg bg-black px-[25px] py-6'>
                  <p className='max-w-3xl text-primary font-semibold text-gray-300'>
                    Завантажте додаток BTC-X і отримайте доступ до торгівлі
                    прямо зараз.
                  </p>
                  <div className='my-6 border-t opacity-[33%]'></div>
                  <div className='flex justify-between'>
                    <Link
                      href='https://apps.apple.com/ua/app/btc-x-pro/id6479724977'
                      target='_blank'
                      rel='noopener noreferrer'
                      className=''
                    >
                      <Image
                        src='/appstore_white.png'
                        alt='App Store'
                        width={185}
                        height={55}
                        className='h-[55px] w-[185px]'
                      />
                    </Link>
                    <Link
                      href='https://play.google.com/store/apps/details?id=btcx.pro'
                      target='_blank'
                      rel='noopener noreferrer'
                      className=''
                    >
                      <Image
                        src='/googleplay_white.png'
                        alt='Google Play'
                        width={185}
                        height={55}
                        className='h-[55px] w-[185px]'
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className='relative h-[500px] w-full'>
              <div className='absolute inset-0 mx-auto h-[669px] w-[826px] rounded-full bg-[#46210D] opacity-50 blur-2xl'></div>
            </div>
            <div className='pointer-events-none absolute right-[-450px] top-[-150px] z-10'>
              <Image
                src='/hero.png'
                alt='Phone'
                width={1268}
                height={951}
                className='relative h-[951px] w-[1268px]'
              />
            </div>
          </div>
        </div>
      </section>

      <section className='py-12'>
        <div className='container mx-auto w-[1340px] px-4 text-center'>
          <p className='text-[40px] leading-[125%]'>
            Ми — платформа для торгівлі та інвестування без комісій і зборів за
            кредитні плечі (ф&apos;ючерси, маржа) за спотовими
          </p>
          <p className='align-center flex justify-center text-[40px] leading-[125%]'>
            цінами таких бірж, як: Binance, OKX, Coinbase
            <span className='relative ml-4 flex items-center justify-start'>
              <Image
                src='/binanceIcon.png'
                alt='Binance'
                width={45}
                height={45}
                className='relative z-10 -ml-2'
              />
              <Image
                src='/okxIcon.png'
                alt='OKX'
                width={45}
                height={45}
                className='relative z-20 -ml-3'
              />
              <Image
                src='/coinbaseIcon.png'
                alt='Coinbase'
                width={45}
                height={45}
                className='relative z-30 -ml-3'
              />
            </span>
          </p>
        </div>
      </section>

      <section className='py-12'>
        <div className='container mx-auto flex w-[1340px] px-4'>
          <div className='w-[610px]'>
            <h2 className='mb-8 text-3xl font-bold md:text-4xl'>
              Торгуй, інвестуй і заробляй в одному місці
            </h2>
            <p className='w-[250px] font-ibm opacity-[33%]'>
              ВТС-Х — всі ринки та інструменти в одному місці
            </p>
          </div>
          <div className='grid'>
            {/* Feature 1 */}
            <div className='relative mb-[25px] w-[670px] overflow-auto rounded-lg bg-gradient-to-r from-[#553300] to-[#FE9900] p-[1px]'>
              <div className='flex rounded-lg bg-black'>
                <div className='w-2/3 px-[25px] py-6'>
                  <h3 className='mb-[40px] text-2xl font-bold text-white'>
                    01. Crypto
                  </h3>
                  <p className='text-base leading-[130%]'>
                    Завойовуйте найдинамічніші ринки, які працюють 24/7.
                    Торгуйте за точними спотовими цінами провідних бірж, без
                    зайвих комісій.
                  </p>
                  <p className='mt-4 text-base leading-[130%] opacity-[33%]'>
                    *Використовуйте кредитне плече для збільшення прибутків без
                    ризику ліквідації.
                  </p>
                </div>
                <Image
                  src='/crypto.png'
                  alt='Crypto'
                  width={480}
                  height={480}
                  className='w-[480px] overflow-auto'
                />
              </div>
            </div>
            {/* Feature 2 */}
            <div className='relative mb-[25px] w-[670px] overflow-auto rounded-lg bg-gradient-to-r from-[#553300] to-[#FE9900] p-[1px]'>
              <div className='flex rounded-lg bg-gradient-to-r from-[#EDEDED] to-[#AFAFAF]'>
                <div className='w-2/3 px-[25px] py-6'>
                  <h3 className='mb-[40px] text-2xl font-bold text-black'>
                    02. Futures
                  </h3>
                  <p className='text-base leading-[130%] text-black'>
                    Отримуйте доступ до глобальних ринків сировини та фондових
                    індексів.
                  </p>
                  <p className='mt-4 text-base leading-[130%] text-black'>
                    Торгуйте з чесними умовами{' '}
                    <span className='text-[#FE9900]'>
                      та відсутністю прихованих зборів
                    </span>
                    , використовуючи інструменти професійного рівня.
                  </p>
                </div>
                <Image
                  src='/futures.png'
                  alt='Futures'
                  width={480}
                  height={480}
                  className='overflow-auto'
                />
              </div>
            </div>
            {/* Feature 3 */}
            <div className='relative mb-[25px] w-[670px] overflow-auto rounded-lg bg-gradient-to-r from-[#553300] to-[#FE9900] p-[1px]'>
              <div className='flex rounded-lg bg-black'>
                <div className='w-2/3 px-[25px] py-6'>
                  <h3 className='mb-[40px] text-2xl font-bold text-white'>
                    03. MEM Coins
                  </h3>
                  <p className='text-base leading-[130%]'>
                    Опануй найволатильніший ринок і зроби на ньому ІКСИ.
                    Використовуйте волатильність цих активів, щоб отримувати
                    високі прибутки.
                  </p>
                </div>
                <Image
                  src='/Mask group.png'
                  alt='MEM Coins'
                  width={602}
                  height={225}
                  className='h-[225px] w-[602px] overflow-auto'
                />
              </div>
            </div>
            {/* Feature 4 */}
            <div className='relative w-[670px] overflow-auto rounded-lg bg-gradient-to-r from-[#553300] to-[#FE9900] p-[1px]'>
              <div className='flex rounded-lg bg-black'>
                <div className='w-2/3 px-[25px] py-6'>
                  <h3 className='mb-[40px] text-2xl font-bold text-white'>
                    04. Stocks
                  </h3>
                  <p className='text-base leading-[130%]'>
                    Торгуйте улюбленими компаніями або відкривайте короткі
                    позиції, щоб отримувати прибуток навіть у моменти, коли
                    ринок падає.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <PlatformStats />
      <FiveSteps />
      <AboutUs />
      <FAQ />
    </main>
  );
}
