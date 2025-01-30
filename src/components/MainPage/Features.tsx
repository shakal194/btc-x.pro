import Image from 'next/image';

export default function FeaturesSection() {
  return (
    <section className='py-[100px]'>
      <div className='container mx-auto gap-8 px-4 lg:flex'>
        <div className=''>
          <h2 className='mb-8 text-[30px] text-font30Leading110 lg:text-font50Leading110'>
            Торгуй, інвестуй і заробляй в одному місці
          </h2>
          <p className='hidden w-[250px] font-ibm text-ibm13Leading130 opacity-[33%] lg:block lg:text-ibm16Leading130'>
            ВТС-Х — всі ринки та інструменти в одному місці
          </p>
        </div>
        <div className='grid'>
          {/* Feature 1 */}
          <div className='relative mb-[25px] h-[325px] overflow-hidden rounded-lg bg-gradient-to-r from-[#553300] to-[#FE9900] p-[1px] lg:w-[670px]'>
            <div className='h-[323px] rounded-lg bg-black lg:flex'>
              <div className='px-[20px] py-[20px] lg:w-2/3 lg:px-[25px] lg:py-6'>
                <h3 className='mb-[20px] text-[24px] font-semibold leading-[110%] text-white lg:mb-[40px] lg:text-[40px]'>
                  01. Crypto
                </h3>
                <p className='text-[13px] font-medium leading-[130%] lg:text-font16Leading130'>
                  Завойовуйте найдинамічніші ринки, які працюють 24/7. Торгуйте
                  за точними спотовими цінами провідних бірж, без зайвих
                  комісій.
                </p>
                <p className='mt-4 text-[13px] font-medium leading-[130%] opacity-[33%] lg:text-font16Leading130'>
                  *Використовуйте кредитне плече для збільшення прибутків без
                  ризику ліквідації.
                </p>
              </div>
              <Image
                src='/features_crypto.png'
                alt='Crypto'
                width={480}
                height={480}
                className='hidden w-[480px] overflow-auto lg:block'
              />
              <Image
                src='/features_crypto_mobile.png'
                alt='Crypto'
                width={300}
                height={325}
                className='absolute bottom-0 h-full w-full min-w-full object-cover lg:hidden'
              />
            </div>
          </div>
          {/* Feature 2 */}
          <div className='relative mb-[25px] h-[300px] overflow-hidden rounded-lg bg-gradient-to-r from-[#EDEDED] to-[#AFAFAF] lg:flex lg:w-[670px]'>
            <div className='px-[20px] py-[20px] lg:w-2/3 lg:px-[25px] lg:py-6'>
              <h3 className='mb-[20px] text-[24px] font-semibold leading-[110%] text-black lg:mb-[40px] lg:text-[40px]'>
                02. Futures
              </h3>
              <p className='text-[13px] font-medium leading-[130%] text-black lg:text-font16Leading130'>
                Отримуйте доступ до глобальних ринків сировини та фондових
                індексів.
              </p>
              <p className='mt-4 text-[13px] font-medium leading-[130%] text-black lg:text-font16Leading130'>
                Торгуйте з чесними умовами{' '}
                <span className='text-[#FE9900]'>
                  та відсутністю прихованих зборів
                </span>
                , використовуючи інструменти професійного рівня.
              </p>
            </div>
            <Image
              src='/features_futures.png'
              alt='Futures'
              width={480}
              height={480}
              className='hidden overflow-auto lg:block'
            />
            <Image
              src='/features_futures_mobile.png'
              alt='Futures'
              width={300}
              height={280}
              className='absolute -bottom-[10px] left-[10px] lg:hidden'
            />
          </div>
          {/* Feature 3 */}
          <div className='z-20 mb-[25px] h-[270px] overflow-hidden rounded-lg bg-gradient-to-r from-[#553300] to-[#FE9900] p-[1px] lg:h-[218px] lg:w-[670px]'>
            <div className='relative h-[268px] rounded-lg bg-black lg:flex lg:h-[216px]'>
              <div className='relative z-10 px-[20px] py-[20px] lg:w-2/3 lg:px-[25px] lg:py-6'>
                <h3 className='mb-[20px] text-[24px] font-medium font-semibold leading-[110%] text-white lg:mb-[40px] lg:text-[40px]'>
                  03. MEM Coins
                </h3>
                <p className='text-[13px] font-medium leading-[130%] lg:text-font16Leading130'>
                  Опануй найволатильніший ринок і зроби на ньому ІКСИ.
                  Використовуйте волатильність цих активів, щоб отримувати
                  високі прибутки.
                </p>
              </div>
              <Image
                src='/features_memcoin.png'
                alt='MEM Coins'
                width={670}
                height={218}
                className='absolute bottom-0 hidden h-[218px] w-[670px] lg:block'
              />
              <Image
                src='/features_memcoin_mobile.png'
                alt='MEM Coins'
                width={300}
                height={280}
                className='absolute bottom-0 left-1/2 w-[280px] -translate-x-1/2 lg:hidden'
              />
            </div>
          </div>
          {/* Feature 4 */}
          <div className='relative flex min-h-[230px] w-full'>
            {/* Текстовый блок */}
            <div className='z-10 h-full px-[20px] py-[20px] lg:w-[45%] lg:px-[25px] lg:py-6'>
              <h3 className='mb-[20px] text-[24px] font-medium font-semibold leading-[110%] text-black lg:mb-[40px] lg:text-[40px]'>
                04. Stocks
              </h3>
              <p className='text-[13px] font-medium leading-[130%] text-black lg:text-font16Leading130'>
                Торгуйте улюбленими компаніями або відкривайте короткі позиції,
                щоб отримувати прибуток навіть у моменти, коли ринок падає.
              </p>
            </div>

            {/* Десктопное изображение */}
            <Image
              src='/features_stocks.png'
              alt='Stock'
              width={670}
              height={218}
              className='absolute hidden h-[218px] w-[670px] object-cover lg:block'
            />

            {/* Мобильное изображение */}
            <Image
              src='/features_stocks_mobile.png'
              alt='Stock'
              width={300}
              height={230}
              className='absolute inset-0 h-full w-full rounded-lg object-cover lg:hidden'
            />
          </div>
        </div>
      </div>
    </section>
  );
}
