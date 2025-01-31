import Image from 'next/image';
import Link from 'next/link';

export default function AboutTokenSection() {
  return (
    <section className='relative z-10 bg-[#F4F4F4] py-[30px] text-black lg:py-[100px]'>
      <div className='container mx-auto px-4'>
        <div className='relative mb-[40px] flex flex-col-reverse xl:mb-[150px] xl:block'>
          {/*<h1 className='text-[400px] font-bold opacity-[2%]'>ВТСХT</h1>*/}
          <div>
            <Image
              src='/btcxt.png'
              alt='BTCX TOKEN'
              width={1340}
              height={328}
              className='h-[77px] w-[320px] object-cover md:h-[100px] md:w-[500px] xl:h-[328px] xl:w-[1340px]'
            />
          </div>
          <div className='container mx-auto mb-[45px] flex flex-col items-center px-4 lg:w-[900px] xl:absolute xl:top-10 xl:mb-0 xl:w-[1210px]'>
            <p className='mb-[30px] w-[82px] text-center font-ibm text-ibm13Leading130 opacity-[33%] lg:w-[250px] lg:text-ibm16Leading130'>
              Що таке ВТСХT?
            </p>
            <h4 className='text-center text-font16Leading120 md:text-font22Leading120 lg:text-[40px] lg:font-semibold lg:leading-[125%] lg:tracking-tight'>
              BTCXT — токен платформи BTC-X, який відкриває доступ до
              ексклюзивних функцій, бонусів та підвищених винагород за вашу
              активність, роблячи торгівлю ще вигіднішою
            </h4>
          </div>
        </div>
        <div className='mb-12 items-end justify-between lg:flex'>
          <h2 className='w-[274px] text-font30Leading110 tracking-tight md:w-[400px] lg:w-[514px] lg:text-font50Leading110'>
            Як отримати токени BTCXT через airdrop?
          </h2>
          <div className='my-6 border-t border-black opacity-[33%] lg:hidden'></div>
          <p className='w-[339px] text-primary font-semibold leading-[110%]'>
            BTC-X виділяє{' '}
            <span className='text-[#FE9900]'>50% всіх токенів</span> BTCXT для
            аірдропу — це 50 000 000 токенів
          </p>
        </div>
        <div className='my-[40px] hidden border-t border-black opacity-[33%] lg:block'></div>
        {/* Блоки контента */}
        <div className='xl:mb-[140px]'>
          {/* Контейнер с шагами */}
          <div className='flex flex-col items-center gap-8 lg:flex-row lg:justify-between'>
            {/* Блок с шагами */}
            <div className='grid grid-cols-5 gap-2 md:grid-cols-2 xl:grid-cols-1'>
              <div className='mb-[28px] flex w-[75%] flex-col items-center md:w-auto xl:flex-row xl:justify-between'>
                {/* Крок 1 */}
                <div className='flex items-center justify-center rounded-full px-[10px] py-[6px] shadow-lg lg:px-[20px] lg:py-[10px]'>
                  <p className='text-[10px] leading-[120%] lg:text-font16Leading110'>
                    Крок 1
                  </p>
                </div>
                <div className='mx-auto h-full border border-2 border-l border-dashed xl:block xl:h-auto xl:w-[30%] xl:border-b'></div>
                {/* Крок 2 */}
                <div className='flex items-center justify-center rounded-full px-[10px] py-[6px] shadow-lg lg:px-[20px] lg:py-[10px]'>
                  <p className='text-[10px] leading-[120%] lg:text-font16Leading110'>
                    Крок 2
                  </p>
                </div>
                <div className='mx-auto h-full border border-2 border-l border-dashed xl:block xl:h-auto xl:w-[30%] xl:border-b'></div>
                {/* Крок 3 */}
                <div className='flex items-center justify-center rounded-full px-[10px] py-[6px] shadow-lg lg:px-[20px] lg:py-[10px]'>
                  <p className='text-[10px] leading-[120%] lg:text-font16Leading110'>
                    Крок 3
                  </p>
                </div>
              </div>

              {/* Описание шагов */}
              <div className='cols-span-4 md:cols-span-0 flex flex-col gap-8 xl:flex-row'>
                <div className='flex w-[300px] flex-col'>
                  <h4 className='mb-[15px] text-[18px] font-semibold leading-[120%] lg:text-[20px]'>
                    Завантажте додаток BTC-X
                  </h4>
                  <p className='text-[13px] leading-[130%] opacity-[50%] lg:text-font16Leading130'>
                    Почніть свою подорож у світ вигідної торгівлі, завантаживши
                    наш додаток із App Store або Google Play.
                  </p>
                </div>

                <div className='flex w-[300px] flex-col'>
                  <h4 className='mb-[15px] text-[18px] font-semibold leading-[120%] lg:text-[20px]'>
                    Торгуйте на платформі BTC-X
                  </h4>
                  <p className='text-[13px] leading-[130%] opacity-[50%] lg:text-font16Leading130'>
                    Кожен ваш торговий обсяг приносить вам бали, які потім
                    конвертуються в токени BTCXT.
                  </p>
                </div>

                <div className='flex w-[300px] flex-col'>
                  <h4 className='mb-[15px] text-[18px] font-semibold leading-[120%] lg:text-[20px]'>
                    Запрошуйте рефералів
                  </h4>
                  <p className='text-[13px] leading-[130%] opacity-[50%] lg:text-font16Leading130'>
                    Ваш торговий обсяг приносить бали, які автоматично
                    конвертуються в токени BTCXT.
                  </p>
                </div>
              </div>
            </div>

            {/* Бонусный блок */}
            <div className='relative w-full md:w-[290px]'>
              <div className='absolute px-[27px] pt-[30px]'>
                <h4 className='bg-gradient-to-r from-[#FFFFFF] to-[#999999] bg-clip-text text-[25px] font-bold leading-[120%] text-transparent'>
                  Отримуйте BTCXT
                </h4>
                <p className='text-white/50'>
                  Обмінюйте отримані токени на цінні бонуси, відкривайте
                  <span className='text-[#FE9900]'>
                    {' '}
                    доступ до ексклюзивних функцій платформи,
                  </span>
                  які підвищать вашу ефективність.
                </p>
                <Link
                  href='https://onelink.to/js2s8h'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='mt-[25px] block w-full rounded-full border px-5 py-3 text-center text-primary font-bold leading-[100%] text-white transition hover:border-[#FD6B06] hover:bg-[#FD6B06] hover:text-white focus:bg-[#FD6B06] focus:text-white xl:mt-[30px]'
                >
                  Перейти в додаток
                </Link>
              </div>
              <Image
                src='/airdrop_btcxt_token.png'
                alt='Airdrop 1'
                width={290}
                height={287}
                className='h-[287px] w-full rounded-3xl object-cover xl:w-[290px]'
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
