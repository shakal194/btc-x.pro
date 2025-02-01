import Image from 'next/image';

export default function HowWorksRefProgramm() {
  return (
    <section className='py-[30px] lg:py-[100px]'>
      <div className='container mx-auto px-4'>
        <div className='mb-12 items-center justify-between md:flex'>
          <h2 className='mb-6 text-font30Leading110 tracking-tight md:w-[500px] lg:w-[753px] lg:text-font50Leading110'>
            Як працює наша крипто-реферальна програма?
          </h2>
          <div className='my-[20px] border-t border-white opacity-[33%] md:hidden'></div>
          <p className='font-ibm text-ibm13Leading130 opacity-[33%] md:w-[230px] md:text-ibm16Leading130 lg:w-[395px]'>
            Ваше винагородження нараховується з обсягу угод запрошених вами
            користувачів.
          </p>
        </div>
        <div className='rounded-3xl bg-white text-black'>
          <div className='flex flex-col-reverse justify-between gap-2 px-[10px] py-[20px] md:gap-4 lg:flex-row lg:gap-8 lg:px-[40px] lg:py-[40px]'>
            <p className='mt-[20px] text-[13px] leading-[130%] opacity-[33%] lg:hidden'>
              * Це дозволяє вам заробляти на кожному рівні та значно збільшувати
              дохід, чим більше активних трейдерів у вашій мережі.
            </p>
            <Image
              src='/diagram_ref_program.png'
              alt='Referral program'
              width={630}
              height={495}
            />
            <div>
              <div className='flex h-full flex-col justify-between'>
                <div>
                  <h2 className='text-[18px] font-semibold leading-[120%] lg:text-[40px]'>
                    В нашій системі присутні два рівні рефералів:
                  </h2>
                  <div className='my-[20px] border-t border-black opacity-[33%] lg:my-[40px]'></div>
                  <ul>
                    <li className='relative pl-5 text-[13px] leading-[130%] md:text-font16Leading120 lg:text-font22Leading120'>
                      <span className='absolute left-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#FE9900]'></span>
                      <span className='text-[#FE9900]'>35%</span> з угод ваших
                      безпосередніх рефералів.
                    </li>
                    <li className='relative pl-5 text-[13px] leading-[130%] md:text-font16Leading120 lg:text-font22Leading120'>
                      <span className='absolute left-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#FE9900]'></span>
                      <span className='text-[#FE9900]'>20%</span> з угод
                      рефералів ваших рефералів.
                    </li>
                  </ul>
                </div>
                <p className='hidden text-font16Leading120 opacity-[33%] lg:block lg:w-[338px]'>
                  * Це дозволяє вам заробляти на кожному рівні та значно
                  збільшувати дохід, чим більше активних трейдерів у вашій
                  мережі.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className='mt-[93px] grid grid-cols-1 items-start gap-8 lg:mt-[200px] lg:grid-cols-2'>
          <div className='relative overflow-auto lg:rounded-3xl lg:bg-gradient-to-r lg:from-[#553300] lg:to-[#FE9900] lg:p-[1px]'>
            <div className='lg:rounded-3xl lg:bg-[#111111] lg:px-[46px] lg:py-[54px]'>
              <div className='flex flex-col-reverse md:flex-row md:justify-between lg:flex-col'>
                <p className='mb-[24px] w-[172px] font-ibm text-ibm13Leading130 opacity-[33%] lg:w-[250px] lg:text-ibm16Leading130'>
                  BTC-X — ваш надійний провідник у світі трейдингу
                </p>
                <div className='my-[20px] border-t opacity-[33%] lg:hidden'></div>
                <h2 className='text-right text-font30Leading110 tracking-tight md:w-[450px] lg:mb-4 lg:w-auto lg:text-left lg:text-font50Leading110'>
                  Більше про реферальну програму BTC-X
                </h2>
              </div>
              <div className='my-[40px] hidden border-t opacity-[33%] md:block'></div>
              <div className='grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4 lg:grid-cols-1 lg:gap-8'>
                <div className='rounded-lg border border-[#999999] px-[15px] py-[25px] lg:px-[30px] lg:py-[30px]'>
                  <h3 className='mb-[29px] text-primary leading-[120%] lg:text-[22px]'>
                    Як і коли я отримаю виплати за реферальною програмою?
                  </h3>
                  <p className='text-white/30'>
                    Ваші винагороди{' '}
                    <span className='text-[#FE9900]'>
                      нараховуються миттєво,
                    </span>{' '}
                    як тільки закривається позиція запрошеного вами користувача.
                    Усі виплати надходять безпосередньо{' '}
                    <span className='text-[#FE9900]'>на ваш баланс BTC-X.</span>
                  </p>
                </div>
                <div className='rounded-lg border border-[#999999] px-[15px] py-[25px] lg:px-[30px] lg:py-[30px]'>
                  <h3 className='mb-[29px] text-primary leading-[120%] lg:text-[22px]'>
                    Як я можу відстежувати свої реферальні виплати?
                  </h3>
                  <p className='text-white/30'>
                    У розділі Реферальна програма на платформі ви зможете легко
                    відстежувати{' '}
                    <span className='text-[#FE9900]'>
                      всі свої виплати та бонуси.
                    </span>
                  </p>
                  <p className='mt-4 text-white/30'>
                    Тут буде відображатись інформація про кількість запрошених
                    користувачів, обсяг їхніх угод{' '}
                    <span className='text-[#FE9900]'>та ваші нагороди.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <Image
            src='/ref_programm_mockup.png'
            alt='Referral program'
            width={630}
            height={550}
            className='hidden h-[550px] w-[630px] lg:block lg:h-auto lg:w-auto'
          />
        </div>
      </div>
    </section>
  );
}
