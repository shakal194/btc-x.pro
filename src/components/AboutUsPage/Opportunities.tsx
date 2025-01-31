import Image from 'next/image';

export default function OpportunitiesSection() {
  return (
    <section className='rounded-t-xl bg-[#F4F4F4] py-[30px] text-black xl:py-[100px]'>
      <div className='container mx-auto mb-[20px] flex flex-col-reverse justify-between px-4 lg:mb-12 lg:flex-row lg:items-center'>
        <h2 className='text-font30Leading110 lg:mb-6 lg:text-font50Leading110'>
          Ми надаємо можливість:
        </h2>
        <p className='mt-[10px] w-[250px] font-ibm text-ibm13Leading130 opacity-[33%] lg:mt-0 lg:text-ibm16Leading130'>
          BTC-X — це про круті можливості та доступ до сучасних фінансових
          інструментів
        </p>
      </div>
      <div className='my-[20px] border-t border-black opacity-[33%] xl:my-[40px]'></div>
      <div className='px-4 xl:mb-12'>
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {/* Карточка 1 */}
          <div className='relative flex h-[255px] flex-col rounded-lg bg-gray-100 p-5 shadow'>
            <div className='z-10'>
              <p className='mb-[20px] text-[18px] font-semibold leading-[110%] md:text-[20px]'>
                Торгувати фінансовими активами
              </p>
              <p className='text-13[px] w-[204px] leading-[130%] text-black/50 md:text-font16Leading110 xl:w-[348px]'>
                Купуйте та продавайте різні фінансові активи за спотовими
                цінами, використовуючи дані з провідних глобальних і
                криптовалютних бірж у реальному часі
              </p>
            </div>
            <Image
              src='/about_us_opportunities_mobile.png'
              alt='Opportunities'
              width={400}
              height={296}
              className='absolute bottom-0 right-0 lg:hidden'
            />
            <Image
              src='/about_us_opportunities.png'
              alt='Opportunities'
              width={463}
              height={285}
              className='absolute -bottom-[18px] -right-[14px] hidden h-[255px] w-[463px] lg:block'
            />
          </div>
          {/* Карточка 2 */}
          <div className='relative flex h-[255px] flex-col rounded-lg bg-gray-100 p-5 shadow'>
            <div className='z-10'>
              <p className='mb-[20px] text-[18px] font-semibold leading-[110%] md:text-[20px]'>
                Торгувати без комісій
              </p>
              <p className='text-13[px] leading-[130%] text-black/50 md:text-font16Leading110'>
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
              <p className='mb-[20px] text-[18px] font-semibold leading-[110%] md:text-[20px]'>
                Збільшувати прибуток з кредитним плечем
              </p>
              <p className='text-13[px] leading-[130%] text-black/50 md:text-font16Leading110'>
                Торгувати з кредитним плечем без додаткових комісій, що значно
                збільшує потенційний прибуток.
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
    </section>
  );
}
