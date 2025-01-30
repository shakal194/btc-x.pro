import StoreButtons from '@/components/ui/StoreButtons';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      <main className='bg-black text-white'>
        {/* Hero Section */}
        <section className='bg-black py-[100px]'>
          <div className='container relative mx-auto w-[1340px] px-4 lg:w-[1340px]'>
            <div className='flex'>
              <div className='z-20 mx-auto'>
                <div className='flex w-[1003px] flex-col items-center text-center'>
                  <h1 className='mb-[30px] bg-gradient-to-r from-[#FFFFFF] to-[#999999] bg-clip-text text-[95px] font-bold leading-[110%] tracking-tight text-transparent'>
                    BTC-X ЗАПУСКАЄ AIRDROP ДЛЯ СВОГО ТОКЕНУ{' '}
                    <span className='bg-gradient-to-r from-[#FFC996] via-[#FD6B06] to-[#963706] bg-clip-text text-transparent'>
                      BTCXT
                    </span>
                  </h1>
                  <p className='text-ibm w-[512px] text-font16Leading130 opacity-[44%]'>
                    [ Це додатковий стимул для залучення нових користувачів та
                    винагороди за активність на платформі ]
                  </p>
                </div>
              </div>
              <div className='pointer-events-none absolute left-1/2 right-[0px] top-1/4 top-[-200px] z-10 w-[110%] -translate-x-1/2 -translate-y-1/4'>
                <Image
                  src='/hero_airdrop.png'
                  alt='Phone'
                  width={2550}
                  height={1200}
                  className='relative h-[1200px] w-[2550px]'
                />
              </div>
            </div>
          </div>
        </section>
        <section className='relative z-20 rounded-xl bg-[#F4F4F4] py-[100px] text-black'>
          <div className='container mx-auto w-[1340px] px-4 lg:w-[1340px]'>
            <div className='relative mb-[150px]'>
              {/*<h1 className='text-[400px] font-bold opacity-[2%]'>ВТСХT</h1>*/}
              <Image
                src='/btcxt.png'
                alt='BTCX TOKEN'
                width={1340}
                height={328}
              />
              <div className='container absolute top-10 mx-auto flex w-[1210px] flex-col items-center lg:w-[1340px]'>
                <p className='mb-[30px] w-[250px] text-center font-ibm text-ibm13Leading130 opacity-[33%] lg:text-ibm16Leading130'>
                  Що таке ВТСХT?
                </p>
                <h4 className='text-center text-[40px] font-semibold leading-[125%] tracking-tight'>
                  BTCXT — токен платформи BTC-X, який відкриває доступ до
                  ексклюзивних функцій, бонусів та підвищених винагород за вашу
                  активність, роблячи торгівлю ще вигіднішою
                </h4>
              </div>
            </div>
            <div className='mb-12 flex items-end justify-between'>
              <h2 className='w-[514px] text-font30Leading110 tracking-tight lg:text-font50Leading110'>
                Як отримати токени BTCXT через airdrop?
              </h2>
              <p className='w-[339px] text-primary font-semibold leading-[110%]'>
                BTC-X виділяє{' '}
                <span className='text-[#FE9900]'>50% всіх токенів</span> BTCXT
                для аірдропу — це 50 000 000 токенів
              </p>
            </div>
            <div className='my-[40px] border-t border-black opacity-[33%]'></div>
            {/* Блоки контента */}
            <div className='mb-[140px]'>
              {/* Блок 1 */}
              {/*<div className='grid grid-cols-1 items-start gap-8 lg:grid-cols-3'>*/}
              <div className='flex justify-between'>
                <div className='w-[75%]'>
                  <div className='mb-[28px] flex w-full justify-between'>
                    <div className='flex items-center justify-center rounded-full px-[20px] py-[10px] shadow-lg'>
                      <p className='text-font16Leading110'>Крок 1</p>
                    </div>
                    <div className='my-auto w-[20%] border border-2 border-b border-dashed'></div>
                    <div className='flex items-center justify-center rounded-full px-[20px] py-[10px] shadow-lg'>
                      <p className='text-font16Leading110'>Крок 2</p>
                    </div>
                    <div className='my-auto w-[20%] border border-2 border-b border-dashed'></div>
                    <div className='flex items-center justify-center rounded-full px-[20px] py-[10px] shadow-lg'>
                      <p className='text-font16Leading110'>Крок 3</p>
                    </div>
                    <div className='my-auto w-[20%] border border-2 border-b border-dashed'></div>
                  </div>
                  <div className='flex justify-between'>
                    <div className='flex w-[300px] flex-col justify-between'>
                      <h4 className='mb-[15px] text-[20px] font-semibold leading-[120%]'>
                        Завантажте додаток BTC-X
                      </h4>
                      <p className='text-font16Leading130 opacity-[50%]'>
                        Почніть свою подорож у світ вигідної торгівлі,
                        завантаживши наш додаток із App Store або Google Play.
                      </p>
                    </div>
                    <div className='flex w-[300px] flex-col justify-between'>
                      <h4 className='mb-[15px] text-[20px] font-semibold leading-[120%]'>
                        Торгуйте на платформі BTC-X
                      </h4>
                      <p className='text-font16Leading130 opacity-[50%]'>
                        Кожен ваш торговий обсяг приносить вам бали, які потім
                        конвертуються в токени BTCXT.
                      </p>
                    </div>{' '}
                    <div className='flex w-[300px] flex-col justify-between'>
                      <h4 className='mb-[15px] text-[20px] font-semibold leading-[120%]'>
                        Запрошуйте рефералів
                      </h4>
                      <p className='text-font16Leading130 opacity-[50%]'>
                        Ваш торговий обсяг приносить бали, які автоматично
                        конвертуються в токени BTCXT.
                      </p>
                    </div>
                  </div>
                </div>
                <div className='relative'>
                  <div className='absolute px-[27px] pt-[30px]'>
                    <h4 className='bg-gradient-to-r from-[#FFFFFF] to-[#999999] bg-clip-text text-[25px] font-bold leading-[120%] text-transparent'>
                      Отримуйте BTCXT
                    </h4>
                    <p className='text-white/50'>
                      Обмінюйте отримані токени на цінні бонуси, відкривайте{' '}
                      <span className='text-[#FE9900]'>
                        доступ до ексклюзивних функцій платформи,
                      </span>{' '}
                      які підвищать вашу ефективність.
                    </p>
                  </div>
                  <Image
                    src='/airdrop_btcxt_token.png'
                    alt='Airdrop 1'
                    width={290}
                    height={287}
                    className='h-[287px] w-[290px] rounded-3xl object-cover'
                  />
                </div>
              </div>
            </div>
            <div className='mb-12 flex items-end justify-between'>
              <h2 className='w-[514px] text-font30Leading110 tracking-tight lg:text-font50Leading110'>
                Рейтинг та винагороди
              </h2>
              <p className='w-[250px] font-ibm text-ibm13Leading130 opacity-[33%] lg:text-ibm16Leading130'>
                Досягайте вищих рангів, щоб отримати ще більше
              </p>
            </div>
            <div className='my-[40px] border-t border-black opacity-[33%]'></div>
            <div className='grid grid-cols-2 gap-16'>
              <div className='flex flex-col justify-between'>
                <h3 className='text-font16Leading120 text-font22Leading120'>
                  Чим більше ви торгуєте,{' '}
                  <span className='text-[#FE9900]'>тим вище ваш ранг,</span> а
                  отже, тим більше балів ви отримаєте. Кожен ранг{' '}
                  <span className='text-[#FE9900]'>дає вам доступ</span> до
                  більшої кількості токенів BTCXT
                </h3>
                <p className='text-ibm text-font16Leading130 text-black/50'>
                  Не забувайте: ви отримуєте більше балів за активну торгівлю та
                  за торгівлю ваших рефералів. Ваш ранг та кількість отриманих
                  забувайте: ви отримуєте більше балів Не за активну торгівлю
                  токенів безпосередньо залежать від вашого торгового обсягу.
                </p>
              </div>
              <div className='w-[608px]'>
                <div className='mb-[20px] flex justify-between'>
                  <div className='flex items-center justify-center rounded-full border px-[20px] py-[10px]'>
                    <p className='text-font16Leading110'>Ранг</p>
                  </div>
                  <div className='flex items-center justify-center rounded-full border px-[20px] py-[10px]'>
                    <p className='text-font16Leading110'>Обсяг за весь час</p>
                  </div>
                </div>
                <div className='mb-[10px] flex items-center justify-between rounded-full bg-white px-[11px] py-[11px] text-black/30'>
                  <div className='flex items-center'>
                    <Image
                      src='/bronze.png'
                      alt='Bronze rate'
                      width={30}
                      height={30}
                      className='mr-[4px] h-[30px] w-[30px] object-cover'
                    />
                    <p>Bronze</p>
                  </div>
                  <div>
                    <p>до 100 000 USD</p>
                  </div>
                </div>
                <div className='flex items-center justify-between rounded-full bg-white px-[11px] py-[11px]'>
                  <div className='flex items-center'>
                    <Image
                      src='/silver.png'
                      alt='Silver rate'
                      width={30}
                      height={30}
                      className='mr-[4px] h-[30px] w-[30px] object-cover'
                    />
                    <p>Silver</p>
                  </div>
                  <div>
                    <p>500 000 USD</p>
                  </div>
                </div>
                <div className='mb-[10px] flex items-center justify-between rounded-full bg-white px-[11px] py-[11px] text-black/30'>
                  <div className='flex items-center'>
                    <Image
                      src='/gold.png'
                      alt='Gold rate'
                      width={30}
                      height={30}
                      className='mr-[4px] h-[30px] w-[30px] object-cover'
                    />
                    <p>Gold</p>
                  </div>
                  <div>
                    <p>1 000 000 USD</p>
                  </div>
                </div>
                <div className='mb-[10px] flex items-center justify-between rounded-full bg-white px-[11px] py-[11px] text-black/30'>
                  <div className='flex items-center'>
                    <Image
                      src='/platinum.png'
                      alt='Platinum rate'
                      width={30}
                      height={30}
                      className='mr-[4px] h-[30px] w-[30px] object-cover'
                    />
                    <p>Platinum</p>
                  </div>
                  <div>
                    <p>2 500 000 USD</p>
                  </div>
                </div>
                <div className='mb-[10px] flex items-center justify-between rounded-full bg-white px-[11px] py-[11px] text-black/30'>
                  <div className='flex items-center'>
                    <Image
                      src='/diamond.png'
                      alt='Diamond rate'
                      width={30}
                      height={30}
                      className='mr-[4px] h-[30px] w-[30px] object-cover'
                    />
                    <p>Diamond</p>
                  </div>
                  <div>
                    <p>5 000 000 USD</p>
                  </div>
                </div>
                <div className='mb-[10px] flex items-center justify-between rounded-full bg-white px-[11px] py-[11px] text-black/30'>
                  <div className='flex items-center'>
                    <Image
                      src='/epic.png'
                      alt='Epic rate'
                      width={30}
                      height={30}
                      className='mr-[4px] h-[30px] w-[30px] object-cover'
                    />
                    <p>Epic</p>
                  </div>
                  <div>
                    <p>10 000 000 USD</p>
                  </div>
                </div>
                <div className='mb-[10px] flex items-center justify-between rounded-full bg-white px-[11px] py-[11px] text-black/30'>
                  <div className='flex items-center'>
                    <div className='flex'>
                      <Image
                        src='/epic.png'
                        alt='Legendary rate'
                        width={30}
                        height={30}
                        className='mr-[4px] h-[30px] w-[30px] object-cover'
                      />
                      <Image
                        src='/epic.png'
                        alt='Legendary rate'
                        width={30}
                        height={30}
                        className='mr-[4px] h-[30px] w-[30px] object-cover'
                      />
                    </div>
                    <p>Legendary</p>
                  </div>
                  <div>
                    <p>25 000 000 USD</p>
                  </div>
                </div>
                <div className='mb-[10px] flex items-center justify-between rounded-full bg-white px-[11px] py-[11px] text-black/30'>
                  <div className='flex items-center'>
                    <div className='flex'>
                      <Image
                        src='/epic.png'
                        alt='Master rate'
                        width={30}
                        height={30}
                        className='mr-[4px] h-[30px] w-[30px] object-cover'
                      />
                      <Image
                        src='/epic.png'
                        alt='Master rate'
                        width={30}
                        height={30}
                        className='mr-[4px] h-[30px] w-[30px] object-cover'
                      />
                      <Image
                        src='/epic.png'
                        alt='Master rate'
                        width={30}
                        height={30}
                        className='mr-[4px] h-[30px] w-[30px] object-cover'
                      />
                    </div>
                    <p>Master</p>
                  </div>
                  <div>
                    <p>50 000 000 USD</p>
                  </div>
                </div>
                <div className='mb-[10px] flex items-center justify-between rounded-full bg-white px-[11px] py-[11px] text-black/30'>
                  <div className='flex items-center'>
                    <Image
                      src='/grandmaster.png'
                      alt='Grandmaster rate'
                      width={30}
                      height={30}
                      className='mr-[4px] h-[30px] w-[30px] object-cover'
                    />
                    <p>Grandmaster</p>
                  </div>
                  <div>
                    <p>100 000 000 USD</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className='pt-[100px]'>
          <div className='container mx-auto px-4 lg:w-[1340px]'>
            <div className='mb-12 flex justify-between'>
              <p className='w-[180px] font-ibm text-ibm13Leading130 opacity-[33%] lg:text-ibm16Leading130'>
                Коли буде запущено токен BTCXT ?
              </p>
              <h2 className='mb-6 w-[664px] text-[40px] font-semibold leading-[125%] tracking-tight text-white/30'>
                Запуск токену BTCXT відбудеться, як тільки на платформі BTC-X
                буде досягнуто{' '}
                <span className='bg-gradient-to-r from-[#FFC996] via-[#FD6B06] to-[#963706] bg-clip-text text-transparent'>
                  1 000 000 000 USD
                </span>{' '}
                торгового обсягу за добу
              </h2>
            </div>
            <div className='mb-[20px] flex'>
              <div className='mr-[15px] flex items-center justify-center rounded-full border border-white/30 px-[20px] py-[10px]'>
                <p className='text-font16Leading110'>
                  Торговий об&apos;єм USD / 24 год
                </p>
              </div>
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
            </div>
            <div className='mb-[100px] text-center'>
              <h2 className='text-[220px] leading-[110%] tracking-tight'>
                999.999.999
              </h2>
            </div>
            <div className='mx-auto mb-[320px] flex w-[1126px] flex-col items-center text-center font-medium'>
              <p className='mb-[33px] w-[257px] font-ibm text-ibm13Leading130 opacity-[33%] lg:text-ibm16Leading130'>
                ВТС-Х — всі ринки та інструменти в одному місці
              </p>
              <h3 className='text-[40px] leading-[125%] tracking-tight'>
                Не втратьте шанс стати частиною майбутнього разом із BTC-X. Чим
                активніше ви торгуєте та запрошуєте друзів,{' '}
                <span className='bg-gradient-to-r from-[#FFC996] via-[#FD6B06] to-[#963706] bg-clip-text text-transparent'>
                  тим більше токенів BTCXT
                </span>{' '}
                ви отримаєте
              </h3>
            </div>
            <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
              <div className='rounded-xl px-[45px] py-[60px] shadow-lg'>
                <p className='mb-[24px] w-[250px] font-ibm text-ibm13Leading130 opacity-[33%] lg:text-ibm16Leading130'>
                  Як визначається ціна токенів BTCXT?
                </p>
                <h2 className='mb-4 text-font30Leading110 lg:text-font50Leading110'>
                  Формування ціни токену BTCXT перед запуском
                </h2>
                <div className='my-[40px] border-t opacity-[33%]'></div>
                <div className='space-y-6'>
                  <div className='mb-5 p-[30px]'>
                    <p className='leading-[130%] text-white/30'>
                      Розрахунок ціни через спред між ціною покупки та продажу
                      сприяє формуванню прозорої та динамічної вартості, яка
                      відображає реальну ринкову активність.
                    </p>
                    <div className='mt-5 flex justify-evenly'>
                      <StoreButtons theme='dark' />
                    </div>
                  </div>
                </div>
              </div>
              {/* Image Section */}
              <div className='relative mb-[200px] h-[700px]'>
                <div className='absolute left-1/2 top-10 w-[407px] -translate-x-1/2 transform text-center'>
                  <h3 className='font-semiboldtext-[20px] mb-[15px] leading-[120%]'>
                    Торгуйте на платформі BTC-X
                  </h3>
                  <p className='text-font16Leading130 text-white/50'>
                    Ціна токенів BTCXT визначається на основі спреду між ціною
                    покупки та продажу для всіх закритих позицій користувачів на
                    платформі
                  </p>
                </div>
                {/* Фоновое изображение */}
                <Image
                  src='/airdrop_diagram.png'
                  alt='Airdrop diagram'
                  width={679}
                  height={779}
                  className='rounded-lg'
                />
              </div>
            </div>
            <div className='mb-[200px] grid grid-cols-1 gap-8 md:grid-cols-2'>
              {/* Image Section */}
              <div className='relative'>
                {/* Фоновое изображение */}
                <Image
                  src='/airdrop_btcxtoken.png'
                  alt='BTCXT Token'
                  width={620}
                  height={600}
                  className='rounded-lg'
                />
              </div>
              <div className='flex flex-col justify-between rounded-xl'>
                <div>
                  <h3 className='text-[50px] font-semibold leading-[120%] tracking-tight'>
                    Не прогавте можливість отримати токени BTC-X
                  </h3>
                  <div className='my-[40px] border-t border-white opacity-[33%]'></div>
                  <p className='text-primary leading-[120%] text-white/30'>
                    Беріть участь в аірдропі, торгуйте на BTC-X, запрошуйте
                    друзів і заробляйте більше! Чим вищий ваш торговий обсяг,
                    тим більше токенів ви отримаєте.
                  </p>
                </div>
                <div className='flex items-center gap-8'>
                  <Image src='/qr.png' alt='QR Code' width={169} height={169} />
                  <div>
                    <h2 className='mb-[40px] text-font30Leading110 lg:text-font50Leading110'>
                      Заробляй з нами
                    </h2>
                    <p className='w-[250px] font-ibm text-ibm13Leading130 opacity-[33%] lg:text-ibm16Leading130'>
                      Скануй щоб завантажити
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className='relative mx-auto pb-6 text-white before:absolute before:bottom-0 before:left-1/2 before:h-[1px] before:w-[1440px] before:-translate-x-1/2 before:bg-gradient-to-r before:from-[#FE9900] before:via-[#FD6B06] before:to-[#FE9900]'>
              <h1 className='text-center text-font18Leading130 text-white/30 lg:text-font30Leading130'>
                Заробляй разом з BTC-X /
              </h1>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
