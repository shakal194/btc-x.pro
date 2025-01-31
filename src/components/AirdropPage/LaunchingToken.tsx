import Image from 'next/image';
import Link from 'next/link';
import StoreButtons from '@/components/ui/StoreButtons';

export default function LaunchingToken() {
  return (
    <section className='py-[30px] xl:py-[100px]'>
      <div className='container mx-auto px-4'>
        <div className='mb-12 justify-between lg:flex'>
          <p className='mb-[10px] w-[110px] font-ibm text-[10px] text-ibm13Leading130 opacity-[33%] lg:mb-0 lg:w-[180px] lg:text-ibm16Leading130'>
            Коли буде запущено токен BTCXT ?
          </p>
          <h2 className='mb-6 w-[294px] text-primary leading-[125%] tracking-tight lg:w-[664px] lg:text-font30Leading110 xl:text-[40px] xl:font-semibold xl:text-white/30'>
            Запуск токену BTCXT відбудеться, як тільки на платформі BTC-X буде
            досягнуто{' '}
            <span className='bg-gradient-to-r from-[#FFC996] via-[#FD6B06] to-[#963706] bg-clip-text text-transparent'>
              1 000 000 000 USD
            </span>{' '}
            торгового обсягу за добу
          </h2>
        </div>
        <div className='my-[20px] border-t opacity-[33%] xl:my-[40px]'></div>
        <div className='mb-[20px] flex'>
          <div className='mr-[15px] flex items-center justify-center rounded-full border border-white/30 px-[20px] py-[10px]'>
            <p className='text-[10px] leading-[120%] lg:text-font16Leading110'>
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
          <h2 className='text-[60px] font-bold leading-[110%] tracking-tight lg:text-[145px] xl:text-[220px]'>
            999.999.999
          </h2>
        </div>
        <div className='mx-auto mb-[120px] flex flex-col items-center text-center font-medium lg:w-[950px] xl:mb-[320px] xl:w-[1126px]'>
          <p className='mb-[33px] hidden w-[257px] font-ibm text-ibm13Leading130 opacity-[33%] lg:block lg:text-ibm16Leading130'>
            ВТС-Х — всі ринки та інструменти в одному місці
          </p>
          <h3 className='text-[18px] leading-[125%] tracking-tight lg:text-[40px]'>
            Не втратьте шанс стати частиною майбутнього разом із BTC-X. Чим
            активніше ви торгуєте та запрошуєте друзів,{' '}
            <span className='bg-gradient-to-r from-[#FFC996] via-[#FD6B06] to-[#963706] bg-clip-text text-transparent'>
              тим більше токенів BTCXT
            </span>{' '}
            ви отримаєте
          </h3>
        </div>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
          <div className='rounded-xl shadow-lg xl:px-[45px] xl:py-[60px]'>
            <p className='mb-[10px] w-[114px] font-ibm text-ibm13Leading130 opacity-[33%] lg:w-[200px] lg:w-[250px] lg:text-ibm16Leading130 xl:mb-[24px]'>
              Як визначається ціна токенів BTCXT?
            </p>
            <h2 className='mb-4 text-font30Leading110 lg:text-font50Leading110'>
              Формування ціни токену BTCXT перед запуском
            </h2>
            <div className='my-[20px] border-t opacity-[33%] xl:my-[40px]'></div>
            <div className='space-y-6'>
              <div className='mb-5 xl:p-[30px]'>
                <p className='text-[13px] leading-[130%] text-white/30 xl:text-primary'>
                  Розрахунок ціни через спред між ціною покупки та продажу
                  сприяє формуванню прозорої та динамічної вартості, яка
                  відображає реальну ринкову активність.
                </p>
                <div className='mt-5 hidden justify-evenly lg:flex'>
                  <StoreButtons theme='dark' />
                </div>
              </div>
            </div>
          </div>
          {/* Image Section */}
          <div className='relative mb-[90px] h-[500px] lg:h-[700px] xl:mb-[200px]'>
            <div className='absolute left-1/2 top-1 w-[407px] w-full -translate-x-1/2 transform text-center xl:top-10'>
              <h3 className='mb-[4px] text-primary font-semibold leading-[125%] tracking-tight md:text-[20px]'>
                Торгуйте на платформі BTC-X
              </h3>
              <p className='mx-auto w-[274px] text-[13px] leading-[130%] text-white/50 md:text-font16Leading130 lg:w-[407px]'>
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
        <div className='mb-[90px] grid grid-cols-1 gap-8 md:grid-cols-2 xl:mb-[200px]'>
          {/* Image Section */}
          <div className='relative'>
            {/* Фоновое изображение */}
            <Image
              src='/airdrop_btcxtoken.png'
              alt='BTCXT Token'
              width={620}
              height={600}
              className='hidden rounded-lg lg:block'
            />
          </div>
          <div className='flex flex-col justify-between rounded-xl'>
            <div>
              <h3 className='text-[28px] font-semibold leading-[110%] tracking-tight xl:text-[50px] xl:leading-[120%]'>
                Не прогавте можливість отримати токени BTC-X
              </h3>
              <div className='my-[20px] border-t border-white opacity-[33%] xl:my-[40px]'></div>
              <p className='text-[13px] leading-[130%] text-white/30 xl:text-primary xl:leading-[120%]'>
                Беріть участь в аірдропі, торгуйте на BTC-X, запрошуйте друзів і
                заробляйте більше! Чим вищий ваш торговий обсяг, тим більше
                токенів ви отримаєте.
              </p>
              <Image
                src='/airdrop_btcxt_token_mobile.png'
                alt='BTCXT Token'
                width={300}
                height={145}
                className='mt-[25px] w-full rounded-lg lg:hidden'
              />
              <Link
                href='https://onelink.to/js2s8h'
                target='_blank'
                rel='noopener noreferrer'
                className='mt-[30px] block w-full rounded-full border px-5 py-3 text-center text-primary font-bold leading-[110%] transition hover:border-[#FD6B06] hover:bg-[#FD6B06] hover:text-white focus:bg-[#FD6B06] focus:text-white lg:hidden'
              >
                Перейти в додаток
              </Link>
            </div>
            <div className='hidden items-center gap-8 lg:flex'>
              <Image
                src='/qr.png'
                alt='QR Code'
                width={169}
                height={169}
                className='hidden md:h-[120px] md:w-[120px] lg:block'
              />
              <div className='hidden lg:block'>
                <h2 className='mb-[40px] text-font30Leading110 xl:text-font50Leading110'>
                  Заробляй разом з нами{' '}
                </h2>
                <p className='w-[250px] font-ibm text-ibm13Leading130 opacity-[33%] lg:text-ibm16Leading130'>
                  Скануй щоб завантажити
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className='relative mx-auto pb-6 text-white before:absolute before:bottom-0 before:left-1/2 before:h-[1px] before:-translate-x-1/2 before:bg-gradient-to-r before:from-[#FE9900] before:via-[#FD6B06] before:to-[#FE9900] xl:before:w-[1440px]'>
          <h1 className='text-center text-font18Leading130 text-white/30 lg:text-font30Leading130'>
            Заробляй разом з BTC-X /
          </h1>
        </div>
      </div>
    </section>
  );
}
