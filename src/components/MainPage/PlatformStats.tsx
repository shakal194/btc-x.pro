import Image from 'next/image';
import Link from 'next/link';
import TradePowerLocalizedImage from '@/components/ui/TradePowerLocalizedImage';

export default function PlatformStats() {
  return (
    <>
      <section className='rounded-t-xl bg-[#F4F4F4] pt-[30px] text-black xl:py-[100px]'>
        <div className='container mx-auto px-4'>
          {/* Статистика */}
          <div className='mb-[20px] flex flex-col-reverse justify-between xl:mb-12 xl:flex-row xl:items-center'>
            <h2 className='mb-6 text-font30Leading110 xl:text-font50Leading110'>
              Наша платформа в цифрах:
            </h2>
            <p className='mb-[10px] w-[145px] font-ibm text-ibm13Leading130 opacity-[33%] xl:mb-0 xl:w-[250px] xl:text-ibm16Leading130'>
              ВТС-Х — довіра, яку підтверджують результати
            </p>
          </div>
          <div className='my-[25px] border-t border-black opacity-[33%] xl:my-[40px]'></div>
          <div className='mb-12'>
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4'>
              {/* Карточка 1 */}
              <div className='flex h-[200px] w-full flex-col justify-between rounded-lg bg-gray-100 p-5 shadow'>
                <p className='text-font16Leading120 xl:text-font22Leading120'>
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
                    <p className='ml-[3px] font-ibm text-ibm13Leading130 leading-[130%] tracking-tight text-[#69DF40] xl:text-ibm16Leading130'>
                      Live
                    </p>
                  </div>
                  <h3 className='text-[45px] font-semibold leading-[120%] xl:text-[50px] xl:font-bold'>
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
                <h3 className='text-[45px] font-semibold leading-[120%] xl:text-[50px] xl:font-bold'>
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
                    <p className='ml-[3px] font-ibm text-ibm13Leading130 leading-[130%] tracking-tight text-[#69DF40] xl:text-ibm16Leading130'>
                      Live
                    </p>
                  </div>
                  <h3 className='text-[45px] font-semibold leading-[120%] xl:text-[50px] xl:font-bold'>
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
                <h3 className='text-[45px] font-semibold leading-[120%] xl:text-[50px] xl:font-bold'>
                  15
                </h3>
              </div>
            </div>
          </div>

          {/* Заголовок и подзаголовок */}
          <div className='mb-[25px] xl:mb-12'>
            <div className='flex justify-between'>
              <p className='hidden w-[250px] font-ibm text-ibm13Leading130 opacity-[33%] xl:block xl:text-ibm16Leading130'>
                Наші переваги
              </p>
              <h2 className='mb-4 text-font30Leading110 tracking-tight xl:w-[630px] xl:text-font50Leading110'>
                Дійсно без жодних комісій та зборів протягом усього 2025 року
              </h2>
            </div>
          </div>

          {/* Блоки контента */}
          <div className='space-y-12'>
            {/* Блок 1 */}
            <div className='my-4 border-t border-black opacity-[33%]'></div>
            <div className='grid grid-cols-1 items-start gap-8 xl:grid-cols-2'>
              <div className='flex items-center justify-between xl:hidden'>
                <h4 className='w-[231px] text-font18Leading130 xl:w-[394px] xl:text-font30Leading130'>
                  ВИ НЕ ПЛАТИТЕ КОМІСІЮ ЗА ВСІ ВИДИ ПОСЛУГ:
                </h4>
                <p className='font-ibm text-ibm13Leading130 leading-[130%] tracking-tight opacity-[33%] xl:text-ibm16Leading130'>
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
              <div className='flex h-full flex-col justify-between gap-2 md:gap-4'>
                <div className='hidden items-center justify-between xl:flex'>
                  <h4 className='w-[231px] text-font18Leading130 xl:w-[394px] xl:text-font30Leading130'>
                    ВИ НЕ ПЛАТИТЕ КОМІСІЮ ЗА ВСІ ВИДИ ПОСЛУГ:
                  </h4>
                  <p className='font-ibm text-ibm13Leading130 leading-[130%] tracking-tight opacity-[33%] xl:text-ibm16Leading130'>
                    [ 01 ]
                  </p>
                </div>
                <div className='flex flex-col justify-between gap-2 md:flex-row md:gap-4 lg:gap-8'>
                  <div className='flex flex-col items-start gap-2 text-[13px] leading-[100%] leading-[120%] xl:text-primary'>
                    <div className='flex items-center'>
                      <Image
                        src='/arrows.png'
                        alt='Arrow'
                        width={42}
                        height={42}
                        className='h-[42px] w-[42px] rotate-180'
                      />
                      <p className='rounded-full border px-3 py-2 text-center'>
                        Вхід у угоду
                      </p>
                    </div>
                    <div className='flex items-center'>
                      <p className='rounded-full border px-3 py-2 text-center'>
                        Вихід із угоди
                      </p>
                      <Image
                        src='/arrows.png'
                        alt='Arrow'
                        width={42}
                        height={42}
                        className='h-[42px] w-[42px] rotate-180'
                      />
                    </div>
                  </div>
                  <div className='grid grid-rows-2 items-start gap-2 text-[13px] leading-[100%] leading-[120%] xl:text-primary'>
                    <div className='rounded-full border px-3 py-2 text-center'>
                      <p>Коли виводите гроші з нашої торгової площадки</p>
                    </div>
                    <div className='rounded-full border px-3 py-2 text-center'>
                      <p>Коли берете кредитне плече</p>
                    </div>
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
            <div className='grid grid-cols-1 items-start gap-8 xl:grid-cols-2'>
              <div className='flex items-center justify-between xl:hidden'>
                <h4 className='w-[231px] text-font18Leading130 xl:w-[394px] xl:text-font30Leading130'>
                  ТОРГОВА СИЛА
                </h4>
                <p className='font-ibm text-ibm13Leading130 opacity-[33%] xl:text-ibm16Leading130'>
                  [ 02 ]
                </p>
              </div>
              <TradePowerLocalizedImage />
              <div className='flex h-full flex-col justify-between gap-2 md:gap-4'>
                <div className='hidden items-center justify-between xl:flex'>
                  <h4 className='w-[231px] text-font18Leading130 xl:w-[394px] xl:text-font30Leading130'>
                    ТОРГОВА СИЛА
                  </h4>
                  <p className='font-ibm text-ibm13Leading130 opacity-[33%] xl:text-ibm16Leading130'>
                    [ 02 ]
                  </p>
                </div>
                <p>
                  Це максимальна сума в USDT, яка може бути використана для
                  відкриття позицій.
                </p>
                <p>
                  Іншими словами, ви ставите кредитне плече на{' '}
                  <span className='text-[#FE9900]'>весь свій депозит</span>
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
            <div className='grid grid-cols-1 items-start gap-8 xl:grid-cols-2'>
              <div className='flex items-center justify-between xl:hidden'>
                <h4 className='w-[231px] text-font18Leading130 xl:w-[394px] xl:text-font30Leading130'>
                  СПРАВЖНІ ЦІНИ
                </h4>
                <p className='font-ibm text-ibm13Leading130 opacity-[33%] xl:text-ibm16Leading130'>
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
              <div className='flex h-full flex-col justify-between gap-2 md:gap-4'>
                <div className='hidden items-center justify-between xl:flex'>
                  <h4 className='w-[231px] text-font18Leading130 xl:w-[394px] xl:text-font30Leading130'>
                    СПРАВЖНІ ЦІНИ
                  </h4>
                  <p className='font-ibm text-ibm13Leading130 opacity-[33%] xl:text-ibm16Leading130'>
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
      <section className='bg-[#F4F4F4] py-[120px] text-black xl:py-[100px]'>
        {/* Миссия */}
        <div className='container mx-auto flex flex-col items-center xl:mt-16 xl:w-[1020px]'>
          <p className='mb-[15px] w-[250px] text-center font-ibm text-ibm13Leading130 opacity-[33%] xl:mb-[30px] xl:text-ibm16Leading130'>
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
