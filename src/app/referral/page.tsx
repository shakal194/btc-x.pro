import StoreButtons from '@/components/ui/StoreButtons';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className='bg-black text-white'>
      {/* Hero Section */}
      <section className='bg-black py-[100px]'>
        <div className='container relative mx-auto px-4 lg:w-[1340px]'>
          <div className='flex'>
            <div className='z-20'>
              <div className='w-[1013px]'>
                <h1 className='text-font75Leading110'>
                  Заробляйте{' '}
                  <span className='bg-gradient-to-r from-[#FFC996] via-[#FD6B06] to-[#963706] bg-clip-text text-transparent'>
                    до 55%
                  </span>{' '}
                  з кожного запрошеного користувача
                </h1>
              </div>
              <div className='mt-[100px] w-[435px]'>
                <p className='max-w-3xl text-primary font-semibold'>
                  Ми пропонуємо вам унікальну можливість отримувати до 55% від
                  прибутку, який ми отримуємо за угоди запрошених вами
                  користувачів
                </p>
                <div className='my-6 border-t opacity-[33%]'></div>
                <div className='flex justify-between'>
                  <StoreButtons theme='dark' />
                </div>
              </div>
            </div>
            <div className='pointer-events-none absolute left-1/2 top-1/4 z-10 w-[110%] -translate-x-1/2 -translate-y-1/4'>
              <Image
                src='/hero_ref_page.png'
                alt='Phone'
                width={2158}
                height={1282}
                className='relative h-[1282px] w-[2158px]'
              />
            </div>
          </div>
        </div>
      </section>
      <section className='relative z-20 rounded-xl bg-[#F4F4F4] py-[100px] pb-[100px] text-black'>
        <div className='container mx-auto px-4 lg:w-[1340px]'>
          {/* Статистика */}
          <div className='mb-12 flex items-center justify-between'>
            <h2 className='mb-6 text-font30Leading110 lg:text-font50Leading110'>
              Як це працює?
            </h2>
            <p className='w-[250px] font-ibm text-ibm13Leading130 opacity-[33%] lg:text-ibm16Leading130'>
              Простий гайд для збільшення твого прибутку
            </p>
          </div>
          <div className='my-[40px] border-t border-black opacity-[33%]'></div>
          {/* Блоки контента */}
          <div className='space-y-12'>
            {/* Блок 1 */}
            {/*<div className='grid grid-cols-1 items-start gap-8 lg:grid-cols-3'>*/}
            <div className='flex justify-between'>
              <div className='flex flex-col justify-evenly'>
                <div className='flex h-[65px] w-[65px] items-center justify-center rounded-full border border-black/30'>
                  <p className='text-font18Leading130 lg:text-font30Leading130'>
                    01
                  </p>
                </div>
                <div className='mx-auto h-[25%] border-2 border-l border-dashed'></div>
                <div className='flex h-[65px] w-[65px] items-center justify-center rounded-full border border-black/30'>
                  <p className='text-font18Leading130 lg:text-font30Leading130'>
                    02
                  </p>
                </div>
                <div className='mx-auto h-[25%] border-2 border-l border-dashed'></div>
                <div className='flex h-[65px] w-[65px] items-center justify-center rounded-full border border-black/30'>
                  <p className='text-font18Leading130 lg:text-font30Leading130'>
                    03
                  </p>
                </div>
              </div>
              <div className='flex w-[485px] flex-col justify-between'>
                <div className='flex flex-col justify-between'>
                  <h4 className='mb-[20px] text-font18Leading130 lg:text-font30Leading130'>
                    Реєстрація та верифікація
                  </h4>
                  <p className='text-primary leading-[120%] opacity-[50%]'>
                    Зареєструйтесь на платформі BTC-X та пройдіть верифікацію,
                    щоб отримати повний доступ до всіх функцій платформи.
                  </p>
                </div>
                <div className='flex flex-col justify-between'>
                  <h4 className='mb-[20px] text-font18Leading130 lg:text-font30Leading130'>
                    Отримай реферальний код
                  </h4>
                  <p className='text-primary leading-[120%] opacity-[50%]'>
                    Перейдіть у розділ &quot;Реферальна програма&quot;, щоб
                    отримати свій унікальний код та посилання для запрошення
                    друзів.
                  </p>
                </div>{' '}
                <div className='flex flex-col justify-between'>
                  <h4 className='mb-[20px] text-font18Leading130 lg:text-font30Leading130'>
                    Діліться можливостями
                  </h4>
                  <p className='text-primary leading-[120%] opacity-[50%]'>
                    Поширюйте свій унікальний лінк та код серед друзів,
                    підписників і партнерів та починайте заробляти
                  </p>
                </div>
              </div>
              <div>
                <Image
                  src='/ref_client.png'
                  alt='Referral client'
                  width={670}
                  height={560}
                  className='h-[560px] w-[670px]'
                ></Image>
              </div>
            </div>
          </div>
          <div className='mb-12 mt-[150px] flex w-full items-center justify-between'>
            <p className='h-[63px] w-[174px] font-ibm text-ibm13Leading130 opacity-[33%] lg:text-ibm16Leading130'>
              BTC-X ділиться з вами до 55% свого доходу
            </p>
            <div className='w-[885px]'>
              <h2 className='mb-6 text-font30Leading110 tracking-tight lg:text-font50Leading110'>
                Чим більший торговий обсяг ваших рефералів, тим більше ви
                заробляєте
              </h2>
              <p>ТУТ БУДЕТ СЛАЙДЕР С NEXTUI</p>
            </div>
          </div>
        </div>
      </section>
      <section className='pt-[100px]'>
        <div className='container mx-auto px-4 lg:w-[1340px]'>
          <div className='mb-12 flex items-center justify-between'>
            <h2 className='mb-6 w-[654px] text-font30Leading110 tracking-tight lg:text-font50Leading110'>
              Для кого підходить наша реферальна програма :
            </h2>
            <p className='w-[250px] font-ibm text-ibm13Leading130 opacity-[33%] lg:text-ibm16Leading130'>
              Долучайтесь до нашої реферальної програми BTC-X
            </p>
          </div>
          <div className='flex gap-4'>
            {[
              {
                image: '/our_program_1.png',
                text: 'Інфлюенсери та власники крипто-каналів в Telegram, YouTube',
              },
              {
                image: '/our_program_2.png',
                text: 'Власники освітніх програм по криптовалютах',
              },
              {
                image: '/our_program_3.png',
                text: 'Арбітражники та власники медійних сайтів',
              },
              {
                image: '/our_program_4.png',
                text: 'Блогери в Instagram та TikTok, які зацікавлені у партнерстві в крипто-ніші',
              },
            ].map((program, index) => (
              <div
                key={index}
                className='group relative h-[477px] w-[342px] overflow-hidden rounded-lg bg-gradient-to-r from-[#FFFFFF]/15 to-[#FFFFFF]/30 p-[1px]'
              >
                <div className='relative flex h-full flex-col rounded-lg bg-[#111111]'>
                  {/* Картинка */}
                  <Image
                    src={program.image}
                    alt={`Our program ${index + 1}`}
                    width={342}
                    height={477}
                    className='h-full w-full rounded-lg object-cover'
                  />

                  {/* Текст */}
                  <div className='absolute bottom-[-50px] left-0 w-full px-4 text-center text-white transition-transform duration-300 ease-in-out group-hover:-translate-y-20'>
                    <h4 className='mb-[20px] text-[22px] leading-[120%]'>
                      {program.text}
                    </h4>

                    {/* Кнопка */}

                    <Link
                      href='https://onelink.to/js2s8h'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='inline-block rounded-full border px-5 py-3 text-primary font-bold leading-[110%] transition hover:border-[#FD6B06] hover:bg-[#FD6B06] hover:text-white focus:bg-[#FD6B06] focus:text-white'
                    >
                      Отримати код
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className='py-[100px]'>
        <div className='container mx-auto px-4 lg:w-[1340px]'>
          <div className='mb-12 flex items-center justify-between'>
            <h2 className='mb-6 w-[753px] text-font30Leading110 tracking-tight lg:text-font50Leading110'>
              Як працює наша крипто-реферальна програма?
            </h2>
            <p className='w-[395px] font-ibm text-ibm13Leading130 opacity-[33%] lg:text-ibm16Leading130'>
              Ваше винагородження нараховується з обсягу угод запрошених вами
              користувачів.
            </p>
          </div>
          <div className='rounded-3xl bg-white text-black'>
            <div className='flex justify-between gap-8 px-[40px] py-[40px]'>
              <Image
                src='/diagram_ref_program.png'
                alt='Referral program'
                width={630}
                height={495}
              />
              <div>
                <h2 className='text-[40px] font-semibold leading-[110%]'>
                  В нашій системі присутні два рівні рефералів:
                </h2>
                <div className='my-[40px] border-t border-black opacity-[33%]'></div>
                <ul>
                  <li className='relative pl-5 text-font16Leading120 text-font22Leading120'>
                    <span className='absolute left-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#FE9900]'></span>
                    <span className='text-[#FE9900]'>35%</span> з угод ваших
                    безпосередніх рефералів.
                  </li>
                  <li className='relative pl-5 text-font16Leading120 text-font22Leading120'>
                    <span className='absolute left-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#FE9900]'></span>
                    <span className='text-[#FE9900]'>20%</span> з угод рефералів
                    ваших рефералів.
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className='mt-[200px] grid grid-cols-1 items-start gap-8 lg:grid-cols-2'>
            <div className='relative overflow-auto rounded-3xl bg-gradient-to-r from-[#553300] to-[#FE9900] p-[1px]'>
              <div className='rounded-3xl bg-[#111111] px-[46px] py-[54px]'>
                <p className='mb-[24px] w-[250px] font-ibm text-ibm13Leading130 opacity-[33%] lg:text-ibm16Leading130'>
                  BTC-X — ваш надійний провідник у світі трейдингу
                </p>
                <h2 className='mb-4 text-font30Leading110 tracking-tight lg:text-font50Leading110'>
                  Більше про реферальну програму BTC-X
                </h2>
                <div className='my-[40px] border-t opacity-[33%]'></div>
                <div className='mb-[20px] rounded-lg border border-[#999999] px-[30px] py-[30px]'>
                  <h3 className='mb-[29px] text-[22px] leading-[120%]'>
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
                <div className='rounded-lg border border-[#999999] px-[30px] py-[30px]'>
                  <h3 className='mb-[29px] text-[22px] leading-[120%]'>
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
            <Image
              src='/ref_programm_mockup.png'
              alt='Referral program'
              width={630}
              height={550}
              className='h-[550px] w-[630px]'
            />
          </div>
        </div>
      </section>
      <section className='rounded-t-xl bg-[#F4F4F4] py-[100px] text-black'>
        <div className='container mx-auto px-4 lg:w-[1340px]'>
          <div className='flex justify-between'>
            <div className='flex flex-col justify-between'>
              <h2 className='text-font30Leading110 lg:text-font50Leading110'>
                Переваги нашої реферальної програми:
              </h2>
              <div>
                <Image
                  src='/coin_ref_programm.png'
                  width={140}
                  height={140}
                  alt='Bitcoin coin'
                />
                <p className='mt-[15px] w-[250px] font-ibm text-ibm13Leading130 opacity-[33%] lg:text-ibm16Leading130'>
                  Долучайтесь до нашої реферальної програми BTC-X
                </p>
              </div>
            </div>
            <div className='w-1/2 space-y-5'>
              {[
                {
                  image: '/guarantee_icon.svg',
                  title: 'Прозорість і миттєві виплати',
                  text: 'Ви завжди можете відстежувати свої доходи в реальному часі через особистий кабінет.',
                },
                {
                  image: '/referal_icon.svg',
                  title: 'Два рівні рефералів',
                  text: 'Отримуйте винагороди не лише за активність користувачів, яких ви запросили, але й за їхніх рефералів.',
                },
                {
                  image: '/save_money_icon.svg',
                  title: 'Доступність для всіх',
                  text: 'Ви можете запрошувати друзів, знайомих чи підписників, незалежно від їхнього досвіду в крипто-торгівлі.',
                },
              ].map((program, index) => (
                <div key={index} className='mb-[15px] px-[30px] py-[30px]'>
                  <div className='relative flex'>
                    {/* Картинка */}
                    <div className='flex h-[100px] w-[100px] items-center justify-center rounded-full border'>
                      <Image
                        src={program.image}
                        alt={`Advantages our programm ${index + 1}`}
                        width={50}
                        height={50}
                        className='h-[50px] w-[50px] object-cover'
                      />
                    </div>
                    {/* Текст */}
                    <div className='ml-4 w-[500px]'>
                      <h3 className='mb-[20px] text-font18Leading130 lg:text-font30Leading130'>
                        {program.title}
                      </h3>
                      <p className='text-primary leading-[120%] text-black/50'>
                        {program.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className='mx-auto mt-[150px] text-center'>
            <Image
              src='/logo_black.png'
              alt='Logo'
              width={133}
              height={133}
              className='mx-auto'
            />
            <h2 className='mb-[49px] text-[105px] text-font30Leading110 lg:text-font50Leading110'>
              Приєднуйся до BTC-X
            </h2>
            <h3 className='mx-auto w-[525px] text-[22px] leading-[120%] opacity-[33%]'>
              Встановлюйте додаток та починайте заробляти з нашою реферальною
              програмою
            </h3>
            <div className='mt-5 flex justify-center gap-4'>
              <StoreButtons theme='dark' />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
