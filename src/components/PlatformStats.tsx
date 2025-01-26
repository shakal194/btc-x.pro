import Image from 'next/image';
import Link from 'next/link';

export default function PlatformStats() {
  return (
    <>
      <section className='rounded-t-xl bg-[#F4F4F4] py-16 text-black'>
        <div className='container mx-auto w-[1340px] px-4'>
          {/* Статистика */}
          <div className='mb-12 flex items-center justify-between'>
            <h2 className='mb-6 text-[50px] font-bold leading-[110%]'>
              Наша платформа в цифрах:
            </h2>
            <p className='w-[250px] font-ibm opacity-[33%]'>
              ВТС-Х — довіра, яку підтверджують результати
            </p>
          </div>
          <div className='my-[40px] border-[0.5px] border-black opacity-[33%]'></div>
          <div className='mb-12'>
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
              {/* Карточка 1 */}
              <div className='flex h-[200px] w-[324px] flex-col justify-between rounded-lg bg-gray-100 p-5 shadow'>
                <p className='w-[196px] text-[22px] font-semibold leading-[120%]'>
                  Торговий обсяг (USD), 24 год.
                </p>
                <div>
                  <div className='flex'>
                    <Image
                      src='/liveIcon.svg'
                      alt='Live Icon'
                      width={6}
                      height={6}
                    ></Image>
                    <p className='ml-[3px] font-ibm leading-[130%] tracking-tight text-[#69DF40]'>
                      Live
                    </p>
                  </div>
                  <h3 className='text-[50px] font-bold leading-[120%]'>
                    11 956 78
                  </h3>
                </div>
              </div>
              {/* Карточка 2 */}
              <div className='flex h-[200px] w-[324px] flex-col justify-between rounded-lg bg-gray-100 p-5 shadow'>
                <p className='text-[22px] font-semibold leading-[120%]'>
                  Торгових пар,{' '}
                  <span className='opacity-[33%]'>
                    включаючи крипту, мем-коїни, акції
                  </span>
                </p>
                <h3 className='text-[50px] font-bold leading-[120%]'>54</h3>
              </div>
              {/* Карточка 3 */}
              <div className='flex h-[200px] w-[324px] flex-col justify-between rounded-lg bg-gray-100 p-5 shadow'>
                <p className='w-[196px] text-[22px] font-semibold leading-[120%]'>
                  Зареєстрованих користувачів
                </p>
                <div>
                  <div className='flex'>
                    <Image
                      src='/liveIcon.svg'
                      alt='Live Icon'
                      width={6}
                      height={6}
                    ></Image>
                    <p className='ml-[3px] font-ibm leading-[130%] tracking-tight text-[#69DF40]'>
                      Live
                    </p>
                  </div>
                  <h3 className='text-[50px] font-bold leading-[120%]'>
                    11 654
                  </h3>
                </div>
              </div>
              {/* Карточка 4 */}
              <div className='flex h-[200px] w-[324px] flex-col justify-between rounded-lg bg-gray-100 p-5 shadow'>
                <p className='text-[22px] font-semibold leading-[120%]'>
                  Країн обслуговування —{' '}
                  <span className='opacity-[33%]'>
                    ВТС-Х міжнародна платформа
                  </span>
                </p>
                <h3 className='text-[50px] font-bold leading-[120%]'>15</h3>
              </div>
            </div>
          </div>

          {/* Заголовок и подзаголовок */}
          <div className='mb-12'>
            <div className='flex justify-between'>
              <p className='w-[250px] font-ibm opacity-[33%]'>Наші переваги</p>
              <h2 className='mb-4 w-[630px] text-[50px] font-semibold leading-[110%] tracking-tight'>
                Дійсно без жодних комісій та зборів протягом усього 2025 року
              </h2>
            </div>
          </div>

          {/* Блоки контента */}
          <div className='space-y-12'>
            {/* Блок 1 */}
            <div className='my-4 border border-black opacity-[33%]'></div>
            <div className='grid grid-cols-1 items-start gap-8 lg:grid-cols-2'>
              <div>
                <Image
                  src='/comission.png'
                  alt='0 comission'
                  width={630}
                  height={290}
                ></Image>
              </div>
              <div className='flex h-full flex-col justify-between'>
                <div className='flex items-center justify-between'>
                  <h4 className='w-[394px] text-[30px] font-bold leading-[130%]'>
                    Ви не платите комісію за всі види послуг:
                  </h4>
                  <p className='font-ibm opacity-[33%]'>[ 01 ]</p>
                </div>
                <div className='flex flex-wrap text-primary leading-[120%]'>
                  <div className='rounded-full border px-5 py-3 text-center'>
                    <p>Вхід у угоду</p>
                  </div>
                  <Image
                    src='/arrows.png'
                    alt='Arrow'
                    width={42}
                    height={42}
                  ></Image>
                  <div className='rounded-full border px-5 py-3 text-center'>
                    <p>Коли виводите гроші з нашої торгової площадки</p>
                  </div>
                  <div className='rounded-full border px-5 py-3 text-center'>
                    <p>Вихід із угоди</p>
                  </div>
                  <Image
                    src='/arrows.png'
                    alt='Arrow'
                    width={42}
                    height={42}
                    className='rotate-180'
                  ></Image>
                  <div className='rounded-full border px-5 py-3 text-center'>
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
            <div className='my-4 border border-black opacity-[33%]'></div>
            <div className='grid grid-cols-1 items-start gap-8 lg:grid-cols-2'>
              <div>
                <Image
                  src='/tradePower.png'
                  alt='0 comission'
                  width={630}
                  height={290}
                ></Image>
              </div>
              <div className='flex h-full flex-col justify-between'>
                <div className='flex items-center justify-between'>
                  <h4 className='w-[394px] text-[30px] font-bold leading-[130%]'>
                    Торговельна сила
                  </h4>
                  <p className='font-ibm opacity-[33%]'>[ 02 ]</p>
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
                <div className='w-[217px] rounded-full border px-5 py-3 text-center'>
                  <Link
                    href='https://onelink.to/js2s8h'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-primary font-bold leading-[100%] transition'
                  >
                    Перейти в додаток
                  </Link>
                </div>
              </div>
            </div>
            {/* Блок 3 */}
            <div className='my-4 border border-black opacity-[33%]'></div>
            <div className='grid grid-cols-1 items-start gap-8 lg:grid-cols-2'>
              <div>
                <Image
                  src='/price.png'
                  alt='0 comission'
                  width={630}
                  height={290}
                ></Image>
              </div>
              <div className='flex h-full flex-col justify-between'>
                <div className='flex items-center justify-between'>
                  <h4 className='w-[394px] text-[30px] font-bold leading-[130%]'>
                    Справжні ціни
                  </h4>
                  <p className='font-ibm opacity-[33%]'>[ 03 ]</p>
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
                <div className='w-[217px] rounded-full border px-5 py-3 text-center'>
                  <Link
                    href='https://onelink.to/js2s8h'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-primary font-bold leading-[100%] transition'
                  >
                    Перейти в додаток
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className='bg-white py-16 text-black'>
        {/* Миссия */}
        <div className='container mx-auto mt-16 flex w-[1020px] flex-col items-center'>
          <p className='w-[250px] text-center font-ibm opacity-[33%]'>
            ВТС-Х — довіра, яку підтверджують результати
          </p>
          <h4 className='text-center text-[40px] font-bold leading-[125%] tracking-tight'>
            Місія BTC-X — зробити фінансову торгівлю доступною, прозорою та
            вигідною для кожного, поєднуючи інновації, простоту та справедливі
            умови
          </h4>
        </div>
      </section>
    </>
  );
}
