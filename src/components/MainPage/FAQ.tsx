import Image from 'next/image';
import StoreButtons from '../ui/StoreButtons';

export default function FAQAndFooter() {
  return (
    <section className='rounded-t-xl bg-[#F4F4F4] py-[30px] text-black lg:py-[100px]'>
      <div className='container mx-auto px-4'>
        <div className='justify-between lg:flex'>
          <h2 className='mb-6 text-font30Leading110 lg:text-font50Leading110'>
            Відповіді на часті запитання
          </h2>
          <div className='space-y-5 lg:w-1/2'>
            {[
              'Що таке BTC-X.pro?',
              'Як зареєструватися у BTC-X.pro?',
              'Питання 3?',
              'Питання 4?',
            ].map((question, index) => (
              <details key={index} className='rounded-md border p-4'>
                <summary className='text-font18Leading130 lg:text-font30Leading130'>
                  {question}
                </summary>
                <p className='mt-2 text-primary leading-[120%] text-black/50'>
                  Відповідь на питання, яка дає пояснення.
                </p>
              </details>
            ))}
          </div>
        </div>
        <div className='mx-auto mt-[49px] text-center lg:mt-[150px] lg:w-[881px]'>
          <Image
            src='/logo_black.png'
            alt='Logo'
            width={133}
            height={133}
            className='mx-auto'
          />
          <h2 className='mb-[49px] hidden text-font30Leading110 font-semibold lg:block lg:text-[105px]'>
            Заробляй з BTC-X
          </h2>
          <h2 className='mb:[25px] text-font30Leading110 lg:mb-[49px] lg:hidden'>
            Приєднуйся до BTC-X
          </h2>
          <h3 className='text-[22px] leading-[120%] opacity-[33%]'>
            Завантажуйте додаток BTC-X і отримайте доступ до торгівлі без
            комісій уже сьогодні
          </h3>
          <div className='mt-[20px] flex justify-center gap-4 lg:mt-5'>
            <StoreButtons theme='light' />
          </div>
        </div>
      </div>
    </section>
  );
}
