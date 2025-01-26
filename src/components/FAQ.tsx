import Image from 'next/image';
import Link from 'next/link';

export default function FAQAndFooter() {
  return (
    <section className='rounded-t-xl bg-[#F4F4F4] py-[100px] text-black'>
      <div className='container mx-auto my-16 w-[1340px] px-4'>
        <div className='flex justify-between'>
          <h2 className='mb-6 text-[50px] font-bold leading-[110%]'>
            Відповіді на часті запитання
          </h2>
          <div className='w-1/2 space-y-5'>
            {[
              'Що таке BTC-X.pro?',
              'Як зареєструватися у BTC-X.pro?',
              'Питання 3?',
              'Питання 4?',
            ].map((question, index) => (
              <details key={index} className='rounded-md border p-4'>
                <summary className='text-[30px] font-semibold leading-[120%]'>
                  {question}
                </summary>
                <p className='mt-2 text-primary leading-[120%] text-black/50'>
                  Відповідь на питання, яка дає пояснення.
                </p>
              </details>
            ))}
          </div>
        </div>
        <div className='mx-auto mt-[150px] w-[881px] text-center'>
          <Image
            src='/logo_black.png'
            alt='Logo'
            width={133}
            height={133}
            className='mx-auto'
          />
          <h2 className='mb-[49px] text-[105px] font-semibold leading-[110%] tracking-tight'>
            Заробляй з BTC-X
          </h2>
          <h3 className='text-[22px] leading-[120%] opacity-[33%]'>
            Завантажуйте додаток BTC-X і отримайте доступ до торгівлі без
            комісій уже сьогодні
          </h3>{' '}
          <div className='mt-5 flex justify-center gap-4'>
            <Link
              href='https://apps.apple.com/ua/app/btc-x-pro/id6479724977'
              target='_blank'
              rel='noopener noreferrer'
              className=''
            >
              <Image
                src='/appstore.png'
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
                src='/googleplay.png'
                alt='Google Play'
                width={185}
                height={55}
                className='h-[55px] w-[185px]'
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
