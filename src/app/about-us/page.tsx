import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <main className='bg-black text-white'>
        {/* Hero Section */}
        <section className='bg-black pt-[100px]'>
          <div className='container relative mx-auto w-[1340px] px-4'>
            <div className='flex'>
              <div className='z-20 mx-auto grid grid-cols-2 gap-4'>
                <div className='flex w-[540px] flex-col'>
                  <h1 className='mb-[88px] bg-gradient-to-r from-[#FFFFFF] to-[#999999] bg-clip-text text-[75px] font-bold leading-[110%] tracking-tight text-transparent'>
                    BTC-X — КОМАНДА, НА ЯКУ{' '}
                    <span className='bg-gradient-to-r from-[#FFC996] via-[#FD6B06] to-[#963706] bg-clip-text text-transparent'>
                      МОЖНА ПОКЛАСТИСЯ
                    </span>
                  </h1>{' '}
                  <div className='relative w-[435px] rounded-lg bg-gradient-to-r from-[#553300] to-[#FE9900] p-[1px]'>
                    <div className='rounded-lg bg-black px-[25px] py-6'>
                      <p className='max-w-3xl text-primary font-semibold text-gray-300'>
                        Завантажуйте додаток BTC-X — довіряйте найкращим у світі
                        фінансів
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
                <div>
                  <Image
                    src='/hero_about_us.png'
                    alt='Our Team'
                    width={670}
                    height={600}
                    className='h-full w-[670px] rounded-3xl object-cover'
                  />
                </div>
              </div>
              <div className='pointer-events-none absolute -right-1/4 -top-1/4 z-10 w-[110%]'>
                <Image
                  src='/hero_about_us_background.png'
                  alt='About Us background'
                  width={1268}
                  height={951}
                  className='relative h-full w-[1268px]'
                />
              </div>
            </div>
          </div>
        </section>
        <div className='container z-20 mx-auto mt-[170px] w-[1340px]'>
          {/* О нас */}
          <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
            <div>
              <h2 className='mb-6 text-[50px] font-bold leading-[110%]'>
                Про нас
              </h2>
              <p className='w-[250px] font-ibm opacity-[33%]'>
                BTC-X — ваш надійний провідник у світі трейдингу
              </p>
            </div>
            <div>
              <p className='mb-[30px] text-[30px] leading-[120%]'>
                Ми — команда цифрових ентузіастів із глибоким досвідом у
                фінансових ринках, яка успішно співпрацює з провідними
                компаніями криптовалютної індустрії та технологій.
              </p>
              <Image
                src='/founder_btc-x.png'
                alt='Founder BTC-X'
                width={412}
                height={273}
                className='h-[273px] w-[412px] rounded-lg'
              />
              <p className='mt-[10px] w-[250px] font-ibm opacity-[33%]'>
                Founder BTC-X
              </p>
            </div>
          </div>
          {/* Наша цель */}
          <div className='mb-[60px] mt-[148px]'>
            <h2 className='text-[50px] font-semibold leading-[110%] tracking-tight text-white/30'>
              Цей досвід надихнув нас створити BTC-X — проєкту, що пропонує
              унікальну перевагу: торгівлю маржинальними позиціями{' '}
              <span className='bg-gradient-to-r from-[#FFC996] via-[#FD6B06] to-[#963706] bg-clip-text text-transparent'>
                без комісії протягом усього 2025 року.
              </span>
            </h2>
          </div>
          <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
            {' '}
            {/* Image Section */}
            <div className='relative'>
              {/* Фоновое изображение */}
              <Image
                src='/about_us_team.png'
                alt='Our Team'
                width={630}
                height={480}
                className='h-[480px] w-[630px] rounded-lg object-cover'
              />
            </div>
            <div className='flex flex-col justify-between'>
              <div>
                <div className='mb-[40px] border-t border-white opacity-[33%]'></div>
                <p className='text-primary leading-[120%]'>
                  Поєднуючи експертність та інноваційний підхід ми працюємо над
                  створенням зручних і прозорих рішень, щоб зробити фінансові
                  технології доступними для кожного користувача.
                </p>
              </div>
              <div className='flex items-center gap-8'>
                <Image src='/qr.png' alt='QR Code' width={169} height={169} />
                <div>
                  <h2 className='mb-[40px] text-[50px] font-bold leading-[110%]'>
                    Заробляй разом з нами{' '}
                  </h2>
                  <p className='w-[250px] font-ibm opacity-[33%]'>
                    Скануй щоб завантажити
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className='container mx-auto mb-[40px] mt-16 flex w-[1190px] flex-col items-center'>
            <p className='w-[375px] text-center font-ibm opacity-[33%]'>
              Наша місія — це не просто ціль, а глобальне завдання, яке формує
              майбутнє.
            </p>
            <h4 className='mb-[40px] text-center text-[40px] font-semibold leading-[125%] tracking-tight'>
              Ми хочемо, щоб усі могли легко та безпечно працювати з фінансовими
              активами. Саме тому наш додаток доступний для завантаження в App
              Store та Google Play майже у всьому світі.
            </h4>
            <div className='flex justify-between'>
              <Link
                href='https://apps.apple.com/ua/app/btc-x-pro/id6479724977'
                target='_blank'
                rel='noopener noreferrer'
                className='mr-[15px]'
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
        <section className='rounded-t-xl bg-[#F4F4F4] py-[100px] pb-[100px] text-black'>
          <div className='container mx-auto w-[1340px] px-4'>
            {/* Статистика */}
            <div className='mb-12 flex items-center justify-between'>
              <h2 className='mb-6 text-[50px] font-bold leading-[110%]'>
                Ми надаємо можливість:
              </h2>
              <p className='w-[250px] font-ibm opacity-[33%]'>
                BTC-X — це про круті можливості та доступ до сучасних фінансових
                інструментів
              </p>
            </div>
            <div className='my-[40px] border-t border-black opacity-[33%]'></div>
            <div className='mb-12'>
              <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                {/* Карточка 1 */}
                <div className='relative flex h-[255px] flex-col rounded-lg bg-gray-100 p-5 shadow'>
                  <div className='z-10'>
                    <p className='mb-[20px] text-[20px] font-semibold leading-[110%]'>
                      Торгувати фінансовими активами
                    </p>
                    <p className='w-[348px] text-[16px] font-medium leading-[110%] text-black/50'>
                      Купуйте та продавайте різні фінансові активи за спотовими
                      цінами, використовуючи дані з провідних глобальних і
                      криптовалютних бірж у реальному часі
                    </p>
                  </div>
                  <Image
                    src='/about_us_opportunities.png'
                    alt='Opportunities'
                    width={463}
                    height={285}
                    className='absolute -bottom-[18px] -right-[14px] h-[255px] w-[463px]'
                  />
                </div>
                {/* Карточка 2 */}
                <div className='relative flex h-[255px] flex-col rounded-lg bg-gray-100 p-5 shadow'>
                  <div className='z-10'>
                    <p className='mb-[20px] text-[20px] font-semibold leading-[110%]'>
                      Торгувати без косімій
                    </p>
                    <p className='text-[16px] font-medium leading-[110%] text-black/50'>
                      Торгувати без комісій як на спотовому ринку, так і на
                      ф&apos;ючерсах, включаючи акції та мемкоїни.{' '}
                    </p>
                  </div>
                  <Image
                    src='/about_us_opportunities_2.png'
                    alt='Opportunities 2'
                    width={463}
                    height={285}
                    className='absolute -bottom-[18px] right-0 h-[255px] w-[463px]'
                  />
                </div>
                {/* Карточка 3 */}
                <div className='relative flex h-[255px] flex-col rounded-lg bg-gray-100 p-5 shadow'>
                  <div className='z-10'>
                    <p className='mb-[20px] text-[20px] font-semibold leading-[110%]'>
                      Збільшувати прибуток з кредитним плечем
                    </p>
                    <p className='text-[16px] font-medium leading-[110%] text-black/50'>
                      Торгувати з кредитним плечем без додаткових комісій, що
                      значно збільшує потенційний прибуток.
                    </p>
                  </div>
                  <Image
                    src='/about_us_opportunities_3.png'
                    alt='Opportunities 3'
                    width={463}
                    height={285}
                    className='absolute bottom-0 right-0 h-[255px] w-[463px]'
                  />
                </div>
              </div>
            </div>

            <div className='my-[150px] grid grid-cols-1 gap-8 md:grid-cols-2'>
              <div>
                <Image
                  src='/about_us_how_it_works.png'
                  alt='How it works'
                  width={630}
                  height={526}
                  className='rounded-lg'
                />
              </div>
              <div className='flex h-full flex-col justify-between'>
                <h4 className='text-[40px] font-semibold leading-[120%] tracking-tight'>
                  Як це працює в цифрах
                </h4>
                <div className='my-6 border-t border-black opacity-[33%]'></div>
                <div className='flex h-full flex-col justify-between'>
                  <h3 className='text-primary font-semibold leading-[120%]'>
                    Припустимо, ви хочете здійснити торгівлю на $1000. Більшість
                    великих бірж стягують комісію за угоду, яка може коливатися
                    від 0.1% до 0.5%. Це означає, що при торгівлі на $1000, ви
                    могли б заплатити від $1 до $5 лише за комісію.
                  </h3>
                  <p className='w-[302px] font-ibm opacity-[33%]'>
                    Забудь про комісії — торгуй вигідно та без обмежень із BTC-X
                  </p>
                </div>
              </div>
            </div>

            {/* Блоки контента */}
            <div className='space-y-12'>
              {/* Блок 2 */}
              <div className='grid grid-cols-1 items-start gap-8 lg:grid-cols-2'>
                <div className='flex h-full flex-col justify-between'>
                  <div className='flex items-center justify-between'>
                    <h4 className='text-[50px] font-semibold leading-[110%] tracking-tight'>
                      Торгівля з кредитним плечем та комісія
                    </h4>
                  </div>
                  <p className='w-[427px] font-ibm opacity-[33%]'>
                    Якщо комісія складає 0.1%, ви заплатите $10 за угоду на
                    $10,000. Якщо комісія складає 0.5% ви заплатите $50 за ту
                    саму угоду
                  </p>
                </div>
                <div>
                  <h3 className='mb-[40px] text-[22px] font-semibold leading-[120%]'>
                    Якщо ви використовуєте кредитне плече, наприклад, 10x, то
                    при угоді на $1000 ви{' '}
                    <span className='text-[#FE9900]'>
                      фактично торгуєте на $10,000.
                    </span>{' '}
                    Це збільшує як потенційний прибуток, так і витрати на
                    комісії.
                  </h3>
                  <Image
                    src='/about_us_cross.png'
                    alt='Cross'
                    width={655}
                    height={160}
                    className='mb-[49px]'
                  ></Image>
                  <div className='mb-[34px] flex items-center'>
                    <div className='mr-[5px] h-[28px] w-[28px] rounded-full bg-[#FE9900]'></div>
                    <p className='text-[22px] font-semibold leading-[120%]'>
                      - Сума ваших вкладень
                    </p>
                  </div>{' '}
                  <div className='flex items-center'>
                    <div className='mr-[5px] h-[28px] w-[28px] rounded-full bg-[#131313]'></div>
                    <p className='text-[22px] font-semibold leading-[120%]'>
                      - Сума угоди з кредитним плечем 10Х
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
