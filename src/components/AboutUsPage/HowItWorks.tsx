import Image from 'next/image';
import TradePowerLocalizedImage from '@/components/ui/TradePowerLocalizedImage';

export default function HowItWorksSection() {
  return (
    <section className='rounded-b-xl bg-[#F4F4F4] py-[30px] text-black xl:py-[100px]'>
      <div className='container mx-auto px-4'>
        {/* Статистика */}

        <div className='mb-[90px] grid grid-cols-1 gap-8 lg:grid-cols-2'>
          <h4 className='text-[40px] font-semibold leading-[120%] tracking-tight lg:hidden'>
            Як це працює в цифрах
          </h4>
          <div>
            <Image
              src='/about_us_how_it_works.png'
              alt='How it works'
              width={630}
              height={526}
              className='w-full rounded-lg'
            />
          </div>
          <div className='flex h-full flex-col justify-between'>
            <h4 className='hidden text-[40px] font-semibold leading-[120%] tracking-tight lg:block'>
              Як це працює в цифрах
            </h4>
            <div className='my-6 hidden border-t border-black opacity-[33%] xl:block'></div>
            <div className='flex h-full flex-col justify-between'>
              <h3 className='text-primary font-semibold leading-[120%]'>
                Припустимо, ви хочете здійснити торгівлю на $1000. Більшість
                великих бірж стягують комісію за угоду, яка може коливатися від
                0.1% до 0.5%. Це означає, що при торгівлі на $1000, ви могли б
                заплатити від $1 до $5 лише за комісію.
              </h3>
              <p className='hidden w-[302px] font-ibm text-ibm13Leading130 opacity-[33%] lg:text-ibm16Leading130 xl:block'>
                Забудь про комісії — торгуй вигідно та без обмежень із BTC-X
              </p>
            </div>
          </div>
        </div>

        <div className='space-y-12'>
          {/* Блок 2 */}
          <div className='grid grid-cols-1 items-start gap-8 lg:grid-cols-2'>
            <div className='flex h-full flex-col justify-between'>
              <div className='flex items-center justify-between'>
                <h4 className='text-font30Leading110 lg:text-font50Leading110'>
                  Торгівля з кредитним плечем та комісія
                </h4>
              </div>
              <p className='hidden w-[427px] font-ibm text-ibm13Leading130 opacity-[33%] lg:block lg:text-ibm16Leading130'>
                Якщо комісія складає 0.1%, ви заплатите $10 за угоду на $10,000.
                Якщо комісія складає 0.5% ви заплатите $50 за ту саму угоду
              </p>
            </div>
            <div className=''>
              <h3 className='mb-[40px] hidden text-font16Leading120 text-font22Leading120 xl:block'>
                Якщо ви використовуєте кредитне плече, наприклад, 10x, то при
                угоді на $1000 ви{' '}
                <span className='text-[#FE9900]'>
                  фактично торгуєте на $20,000.
                </span>{' '}
                Це збільшує як потенційний прибуток, так і витрати на комісії.
              </h3>
              <div className='xl:hidden'>
                <TradePowerLocalizedImage />
              </div>
              <p className='mt-[20px] font-ibm text-ibm13Leading130 opacity-[33%] md:text-ibm16Leading130 lg:hidden'>
                Якщо комісія складає 0.1%, ви заплатите $10 за угоду на $10,000.
                Якщо комісія складає 0.5% ви заплатите $50 за ту саму угоду
              </p>
              <Image
                src='/about-us_trading_power.png'
                alt='Cross'
                width={655}
                height={160}
                className='mb-[49px] hidden xl:block'
              />
              <div className='mb-[34px] hidden items-center xl:flex'>
                <div className='mr-[5px] h-[28px] w-[28px] rounded-full bg-[#FE9900]'></div>
                <p className='text-font16Leading120 text-font22Leading120'>
                  - Сума ваших вкладень
                </p>
              </div>{' '}
              <div className='hidden items-center xl:flex'>
                <div className='mr-[5px] h-[28px] w-[28px] rounded-full bg-[#131313]'></div>
                <p className='text-font16Leading120 text-font22Leading120'>
                  - Сума угоди з кредитним плечем 20Х
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
