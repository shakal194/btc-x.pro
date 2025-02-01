import Image from 'next/image';

export default function HowItWorksSection() {
  return (
    <section className='relative z-20 rounded-xl bg-[#F4F4F4] py-[30px] text-black lg:py-[100px]'>
      <div className='container mx-auto px-4'>
        {/* Статистика */}
        <div className='flex flex-col-reverse justify-between md:flex-row md:items-center lg:mb-12'>
          <h2 className='text-font30Leading110 lg:mb-6 lg:text-font50Leading110'>
            Як це працює?
          </h2>
          <p className='mb-[10px] w-[155px] font-ibm text-ibm13Leading130 opacity-[33%] lg:mb-0 lg:w-[250px] lg:text-ibm16Leading130'>
            Простий гайд для збільшення твого прибутку
          </p>
        </div>
        <div className='my-[20px] border-t border-black opacity-[33%] lg:my-[40px]'></div>
        {/* Блоки контента */}
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
          {/* Блок 1 */}
          <div className='grid grid-cols-6 gap-8'>
            <div className='flex flex-col items-center justify-evenly'>
              <div className='flex h-[40px] w-[40px] items-center justify-center rounded-full border border-black/30 lg:h-[65px] lg:w-[65px]'>
                <p className='text-font18Leading130 lg:text-font30Leading130'>
                  01
                </p>
              </div>
              <div className='mx-auto h-[25%] border-2 border-l border-dashed'></div>
              <div className='flex h-[40px] w-[40px] items-center justify-center rounded-full border border-black/30 lg:h-[65px] lg:w-[65px]'>
                <p className='text-font18Leading130 lg:text-font30Leading130'>
                  02
                </p>
              </div>
              <div className='mx-auto h-[25%] border-2 border-l border-dashed'></div>
              <div className='flex h-[40px] w-[40px] items-center justify-center rounded-full border border-black/30 lg:h-[65px] lg:w-[65px]'>
                <p className='text-font18Leading130 lg:text-font30Leading130'>
                  03
                </p>
              </div>
            </div>
            <div className='cols-span-5 flex w-[295px] flex-col justify-between gap-4 lg:w-[485px] lg:gap-8'>
              <div className='flex flex-col justify-between'>
                <h4 className='mb-[7px] text-font18Leading130 lg:mb-[20px] lg:text-font30Leading130'>
                  Реєстрація та верифікація
                </h4>
                <p className='text-[13px] leading-[120%] opacity-[50%] lg:text-primary'>
                  Зареєструйтесь на платформі BTC-X та пройдіть верифікацію, щоб
                  отримати повний доступ до всіх функцій платформи.
                </p>
              </div>
              <div className='flex flex-col justify-between'>
                <h4 className='mb-[7px] text-font18Leading130 lg:mb-[20px] lg:text-font30Leading130'>
                  Отримай реферальний код
                </h4>
                <p className='text-[13px] leading-[120%] opacity-[50%] lg:text-primary'>
                  Перейдіть у розділ &quot;Реферальна програма&quot;, щоб
                  отримати свій унікальний код та посилання для запрошення
                  друзів.
                </p>
              </div>{' '}
              <div className='flex flex-col justify-between'>
                <h4 className='mb-[7px] text-font18Leading130 lg:mb-[20px] lg:text-font30Leading130'>
                  Діліться можливостями
                </h4>
                <p className='text-[13px] leading-[120%] opacity-[50%] lg:text-primary'>
                  Поширюйте свій унікальний лінк та код серед друзів,
                  підписників і партнерів та починайте заробляти
                </p>
              </div>
            </div>
          </div>
          <div>
            <Image
              src='/ref_client.png'
              alt='Referral client'
              width={670}
              height={560}
              className='w-full lg:h-[560px] lg:w-[670px]'
            ></Image>
          </div>
        </div>
        <div className='mb-12 mt-[90px] w-full lg:mt-[150px]'>
          <div className='flex flex-col justify-between md:flex-row md:items-center'>
            <p className='mb-[10px] w-[174px] font-ibm text-[10px] opacity-[33%] md:text-ibm13Leading130 lg:mb-0 lg:h-[63px] lg:text-ibm16Leading130'>
              BTC-X ділиться з вами до 55% свого доходу
            </p>

            <h2 className='mb-6 text-[28px] font-semibold leading-[110%] tracking-tight md:w-[450px] md:text-font30Leading110 lg:w-[885px] lg:text-font50Leading110 lg:font-semibold'>
              Чим більший торговий обсяг ваших рефералів, тим більше ви
              заробляєте
            </h2>
          </div>
          <p>ТУТ БУДЕТ СЛАЙДЕР С NEXTUI</p>
        </div>
      </div>
    </section>
  );
}
