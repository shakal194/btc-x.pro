import Image from 'next/image';
import Link from 'next/link';

export default function PlatformStats() {
  return (
    <>
      <section className='rounded-t-xl bg-[#F4F4F4] pt-[30px] text-black lg:py-[100px]'>
        <div className='container mx-auto px-4'>
          {/* Статистика */}
          <div className='mb-[20px] flex flex-col-reverse justify-between lg:mb-12 lg:flex-row lg:items-center'>
            <h2 className='mb-6 text-font30Leading110 lg:text-font50Leading110'>
              Наша платформа в цифрах:
            </h2>
            <p className='mb-[10px] w-[145px] font-ibm text-ibm13Leading130 opacity-[33%] lg:mb-0 lg:w-[250px] lg:text-ibm16Leading130'>
              ВТС-Х — довіра, яку підтверджують результати
            </p>
          </div>
          <div className='my-[25px] border-t border-black opacity-[33%] lg:my-[40px]'></div>
          <div className='mb-12'>
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
              {/* Карточка 1 */}
              <div className='flex h-[200px] w-full flex-col justify-between rounded-lg bg-gray-100 p-5 shadow'>
                <p className='text-font16Leading120 text-font22Leading120'>
                  Торговий обсяг (USD), 24 год.
                </p>
                <div>
                  <div className='flex items-center'>
                    <Image
                      src='/live_icon.svg'
                      alt='Live Icon'
                      width={6}
                      height={6}
                      className='h-[6px] w-[6px]'
                    ></Image>
                    <p className='ml-[3px] font-ibm text-ibm13Leading130 leading-[130%] tracking-tight text-[#69DF40] lg:text-ibm16Leading130'>
                      Live
                    </p>
                  </div>
                  <h3 className='text-[45px] font-semibold leading-[120%] lg:text-[50px] lg:font-bold'>
                    11 956 78
                  </h3>
                </div>
              </div>
              {/* Карточка 2 */}
              <div className='flex h-[200px] w-full flex-col justify-between rounded-lg bg-gray-100 p-5 shadow'>
                <p className='text-font16Leading120 text-font22Leading120'>
                  Торгових пар,{' '}
                  <span className='opacity-[33%]'>
                    включаючи крипту, мем-коїни, акції
                  </span>
                </p>
                <h3 className='text-[45px] font-semibold leading-[120%] lg:text-[50px] lg:font-bold'>
                  54
                </h3>
              </div>
              {/* Карточка 3 */}
              <div className='flex h-[200px] w-full flex-col justify-between rounded-lg bg-gray-100 p-5 shadow'>
                <p className='text-font16Leading120 text-font22Leading120'>
                  Зареєстрованих користувачів
                </p>
                <div>
                  <div className='flex items-center'>
                    <Image
                      src='/live_icon.svg'
                      alt='Live Icon'
                      width={6}
                      height={6}
                      className='h-[6px] w-[6px]'
                    ></Image>
                    <p className='ml-[3px] font-ibm text-ibm13Leading130 leading-[130%] tracking-tight text-[#69DF40] lg:text-ibm16Leading130'>
                      Live
                    </p>
                  </div>
                  <h3 className='text-[45px] font-semibold leading-[120%] lg:text-[50px] lg:font-bold'>
                    11 654
                  </h3>
                </div>
              </div>
              {/* Карточка 4 */}
              <div className='flex h-[200px] w-full flex-col justify-between rounded-lg bg-gray-100 p-5 shadow'>
                <p className='text-font16Leading120 text-font22Leading120'>
                  Країн обслуговування —{' '}
                  <span className='opacity-[33%]'>
                    ВТС-Х міжнародна платформа
                  </span>
                </p>
                <h3 className='text-[45px] font-semibold leading-[120%] lg:text-[50px] lg:font-bold'>
                  15
                </h3>
              </div>
            </div>
          </div>

          {/* Заголовок и подзаголовок */}
          <div className='mb-[25px] lg:mb-12'>
            <div className='flex justify-between'>
              <p className='hidden w-[250px] font-ibm text-ibm13Leading130 opacity-[33%] lg:block lg:text-ibm16Leading130'>
                Наші переваги
              </p>
              <h2 className='mb-4 text-font30Leading110 tracking-tight lg:w-[630px] lg:text-font50Leading110'>
                Дійсно без жодних комісій та зборів протягом усього 2025 року
              </h2>
            </div>
          </div>

          {/* Блоки контента */}
          <div className='space-y-12'>
            {/* Блок 1 */}
            <div className='my-4 border-t border-black opacity-[33%]'></div>
            <div className='grid grid-cols-1 items-start gap-8 lg:grid-cols-2'>
              <div className='flex items-center justify-between lg:hidden'>
                <h4 className='w-[231px] text-font18Leading130 lg:w-[394px] lg:text-font30Leading130'>
                  ВИ НЕ ПЛАТИТЕ КОМІСІЮ ЗА ВСІ ВИДИ ПОСЛУГ:
                </h4>
                <p className='font-ibm text-ibm13Leading130 leading-[130%] tracking-tight opacity-[33%] lg:text-ibm16Leading130'>
                  [ 01 ]
                </p>
              </div>
              <div>
                <Image
                  src='/comission.png'
                  alt='0 comission'
                  width={630}
                  height={290}
                  className='w-full'
                ></Image>
              </div>
              <div className='grid-row-4 grid gap-x-4 gap-y-[34px]'>
                <div className='hidden items-center justify-between lg:flex'>
                  <h4 className='w-[231px] text-font18Leading130 lg:w-[394px] lg:text-font30Leading130'>
                    ВИ НЕ ПЛАТИТЕ КОМІСІЮ ЗА ВСІ ВИДИ ПОСЛУГ:
                  </h4>
                  <p className='font-ibm text-ibm13Leading130 leading-[130%] tracking-tight opacity-[33%] lg:text-ibm16Leading130'>
                    [ 01 ]
                  </p>
                </div>
                <div className='flex items-center text-[13px] leading-[100%] leading-[120%] lg:text-primary'>
                  <div className='rounded-full border px-3 py-2 text-center'>
                    <p>Вхід у угоду</p>
                  </div>
                  <Image
                    src='/arrows.png'
                    alt='Arrow'
                    width={42}
                    height={42}
                    className='h-[42px] w-[42px]'
                  ></Image>
                  <div className='rounded-full border px-3 py-2 text-center'>
                    <p>Коли виводите гроші з нашої торгової площадки</p>
                  </div>
                </div>
                <div className='flex items-center text-[13px] leading-[100%] leading-[120%] lg:text-primary'>
                  <div className='rounded-full border px-3 py-2 text-center'>
                    <p>Вихід із угоди</p>
                  </div>
                  <Image
                    src='/arrows.png'
                    alt='Arrow'
                    width={42}
                    height={42}
                    className='h-[42px] w-[42px] rotate-180'
                  ></Image>
                  <div className='rounded-full border px-3 py-2 text-center'>
                    <p>Коли берете кредитне плече</p>
                  </div>
                </div>
                <p>
                  Статистика показує, що трейдери втрачають сотні тисяч доларів
                  на комісіях і не помічають цього!
                </p>
              </div>
            </div>
            {/* Блок 2 */}
            <div className='my-4 border-t border-black opacity-[33%]'></div>
            <div className='grid grid-cols-1 items-start gap-8 lg:grid-cols-2'>
              <div className='flex items-center justify-between lg:hidden'>
                <h4 className='w-[231px] text-font18Leading130 lg:w-[394px] lg:text-font30Leading130'>
                  ТОРГОВЕЛЬНА СИЛА
                </h4>
                <p className='font-ibm text-ibm13Leading130 opacity-[33%] lg:text-ibm16Leading130'>
                  [ 02 ]
                </p>
              </div>
              <div>
                <Image
                  src='/trade_power.png'
                  alt='Trade power'
                  width={630}
                  height={290}
                  className='w-full'
                ></Image>
              </div>
              <div className='grid-row-4 grid gap-x-8 gap-y-[50px]'>
                <div className='hidden items-center justify-between lg:flex'>
                  <h4 className='w-[231px] text-font18Leading130 lg:w-[394px] lg:text-font30Leading130'>
                    ТОРГОВЕЛЬНА СИЛА
                  </h4>
                  <p className='font-ibm text-ibm13Leading130 opacity-[33%] lg:text-ibm16Leading130'>
                    [ 02 ]
                  </p>
                </div>
                <p>
                  Це максимальна сума в USDT яка може бути використана для всіх
                  відкритих позицій і яка залишається доступною незалежно від
                  результатів вашої торгівлі.
                </p>
                <p>
                  Іншими словами, ви ставите кредитне плече на свій депозит, але{' '}
                  <span className='text-[#FE9900]'>
                    вас не можуть ліквідувати
                  </span>
                </p>
                <Link
                  href='https://onelink.to/js2s8h'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='w-[217px] rounded-full border px-3 py-2 text-center text-primary font-bold leading-[100%] transition hover:bg-[#FD6B06] hover:text-white'
                >
                  Перейти в додаток
                </Link>
              </div>
            </div>
            {/* Блок 3 */}
            <div className='my-4 border-t border-black opacity-[33%]'></div>
            <div className='grid grid-cols-1 items-start gap-8 lg:grid-cols-2'>
              <div className='flex items-center justify-between lg:hidden'>
                <h4 className='w-[231px] text-font18Leading130 lg:w-[394px] lg:text-font30Leading130'>
                  СПРАВЖНІ ЦІНИ
                </h4>
                <p className='font-ibm text-ibm13Leading130 opacity-[33%] lg:text-ibm16Leading130'>
                  [ 03 ]
                </p>
              </div>
              <div>
                <Image
                  src='/price.png'
                  alt='Real prices'
                  width={630}
                  height={290}
                  className='w-full'
                />
              </div>
              <div className='grid-row-4 grid gap-8'>
                <div className='hidden items-center justify-between lg:flex'>
                  <h4 className='w-[231px] text-font18Leading130 lg:w-[394px] lg:text-font30Leading130'>
                    СПРАВЖНІ ЦІНИ
                  </h4>
                  <p className='font-ibm text-ibm13Leading130 opacity-[33%] lg:text-ibm16Leading130'>
                    [ 03 ]
                  </p>
                </div>
                <p>
                  Інші торгові платформи та брокерські компанії штучно
                  збільшують різницю між цінами купівлі та продажу, ставлячи вас
                  у невигідне становище.{' '}
                  <span className='text-[#FE9900]'>Ми так не робимо,</span> у
                  нас інші цілі компанії
                </p>
                <p>
                  Наша мета — забезпечити{' '}
                  <span className='text-[#FE9900]'>
                    прозорі та чесні умови торгівлі,
                  </span>{' '}
                  щоб ви могли зосередитися на своїх фінансових цілях.
                </p>
                <Link
                  href='https://onelink.to/js2s8h'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='w-[217px] rounded-full border px-3 py-2 text-center text-primary font-bold leading-[100%] transition hover:bg-[#FD6B06] hover:text-white'
                >
                  Перейти в додаток
                </Link>
              </div>
            </div>
            <div className='my-4 border-t border-black opacity-[33%]'></div>
          </div>
        </div>
      </section>
      <section className='bg-[#F4F4F4] py-[120px] text-black lg:py-[100px]'>
        {/* Миссия */}
        <div className='container mx-auto flex flex-col items-center lg:mt-16 lg:w-[1020px]'>
          <p className='mb-[15px] w-[250px] text-center font-ibm text-ibm13Leading130 opacity-[33%] lg:mb-[30px] lg:text-ibm16Leading130'>
            ВТС-Х — довіра, яку підтверджують результати
          </p>
          <h4 className='text-center text-[18px] font-medium leading-[125%] tracking-tight lg:text-[40px] lg:font-bold'>
            Місія BTC-X — зробити фінансову торгівлю доступною, прозорою та
            вигідною для кожного, поєднуючи інновації, простоту та справедливі
            умови
          </h4>
        </div>
      </section>
    </>
  );
}
