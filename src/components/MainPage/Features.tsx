import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function FeaturesSection() {
  const t = useTranslations('mainPage.features');

  return (
    <section className='py-[100px]'>
      <div className='container mx-auto gap-8 px-4 lg:flex'>
        <div className=''>
          <h2 className='mb-8 text-[30px] text-font30Leading110 lg:text-font50Leading110'>
            {t('title')}
          </h2>
          <p className='hidden w-[250px] font-ibm text-ibm13Leading130 opacity-[33%] lg:block lg:text-ibm16Leading130'>
            {t('subtitle')}
          </p>
        </div>
        <div className='grid gap-2 md:grid-cols-2 md:gap-4 lg:grid-cols-none'>
          {/* Feature 1 */}
          <div className='relative h-[300px] overflow-hidden rounded-lg bg-gradient-to-r from-[#553300] to-[#FE9900] p-[1px] lg:w-[670px]'>
            <div className='h-[298px] rounded-lg bg-black lg:flex'>
              <div className='px-[20px] py-[20px] lg:w-2/3 lg:px-[25px] lg:py-6'>
                <h3 className='mb-[20px] text-[24px] font-semibold leading-[110%] text-white lg:mb-[40px] lg:text-[40px]'>
                  {t('feature_1_title')}
                </h3>
                <p className='text-[13px] font-medium leading-[130%] lg:text-font16Leading130'>
                  {t('feature_1_subtitle')}
                </p>
                <p className='mt-4 text-[13px] font-medium leading-[130%] opacity-[33%] lg:text-font16Leading130'>
                  {t('feature_1_subtitle_2')}
                </p>
              </div>
              <Image
                src='/features_crypto.png'
                alt='Crypto'
                width={480}
                height={480}
                className='animate-spin-slow hidden w-[480px] overflow-auto lg:block'
              />
              <Image
                src='/features_crypto_mobile.png'
                alt='Crypto'
                width={403}
                height={406}
                className='animate-spin-slow absolute h-full w-full min-w-full object-cover lg:hidden'
              />
            </div>
          </div>
          {/* Feature 2 */}
          <div className='relative h-[300px] overflow-hidden rounded-lg bg-gradient-to-r from-[#EDEDED] to-[#AFAFAF] lg:flex lg:w-[670px]'>
            <div className='px-[20px] py-[20px] lg:w-2/3 lg:px-[25px] lg:py-6'>
              <h3 className='mb-[20px] text-[24px] font-semibold leading-[110%] text-black lg:mb-[40px] lg:text-[40px]'>
                {t('feature_2_title')}
              </h3>
              <p className='text-[13px] font-medium leading-[130%] text-black lg:text-font16Leading130'>
                {t('feature_2_subtitle')}
              </p>
              <p className='mt-4 text-[13px] font-medium leading-[130%] text-black lg:text-font16Leading130'>
                {t('feature_2_subtitle_2')}{' '}
                <span className='text-[#FE9900]'>
                  {t('feature_2_subtitle_3')}
                </span>{' '}
                {t('feature_2_subtitle_4')}
              </p>
            </div>
            <Image
              src='/features_futures.png'
              alt='Futures'
              width={480}
              height={480}
              className='hidden overflow-auto lg:block'
            />
            <Image
              src='/features_futures_mobile.png'
              alt='Futures'
              width={300}
              height={280}
              className='absolute -bottom-[10px] left-[10px] w-[300px] lg:hidden'
            />
          </div>
          {/* Feature 3 */}
          <div className='z-20 h-[300px] overflow-hidden rounded-lg bg-gradient-to-r from-[#553300] to-[#FE9900] p-[1px] lg:h-[218px] lg:w-[670px]'>
            <div className='relative h-[298px] rounded-lg bg-black lg:flex lg:h-[216px]'>
              <div className='relative z-10 px-[20px] py-[20px] lg:w-2/3 lg:px-[25px] lg:py-6'>
                <h3 className='mb-[20px] text-[24px] font-semibold leading-[110%] text-white lg:mb-[40px] lg:text-[40px]'>
                  {t('feature_3_title')}
                </h3>
                <p className='text-[13px] font-medium leading-[130%] lg:text-font16Leading130'>
                  {t('feature_3_subtitle')}
                </p>
              </div>
              <Image
                src='/features_memcoin.png'
                alt='MEM Coins'
                width={670}
                height={218}
                className='absolute bottom-0 hidden h-[218px] w-[670px] lg:block'
              />
              <Image
                src='/features_memcoin_mobile.png'
                alt='MEM Coins'
                width={300}
                height={280}
                className='absolute bottom-0 left-1/2 w-[280px] -translate-x-1/2 lg:hidden'
              />
            </div>
          </div>
          {/* Feature 4 */}
          <div className='relative flex h-[300px] w-full lg:w-[670px]'>
            {/* Текстовый блок */}
            <div className='z-10 h-full rounded-lg px-[20px] py-[20px] lg:w-[50%] lg:px-[25px] lg:py-6'>
              <h3 className='mb-[20px] text-[24px] font-semibold leading-[110%] text-black lg:mb-[40px] lg:text-[40px]'>
                {t('feature_4_title')}
              </h3>
              <p className='text-[13px] font-medium leading-[130%] text-black lg:text-font16Leading130'>
                {t('feature_4_subtitle')}
              </p>
            </div>

            {/* Десктопное изображение */}
            <Image
              src='/features_stocks.png'
              alt='Stock'
              width={670}
              height={218}
              className='absolute hidden h-auto w-[670px] rounded-lg object-cover lg:block'
            />

            {/* Мобильное изображение */}
            <Image
              src='/features_stocks_mobile.png'
              alt='Stock'
              width={300}
              height={230}
              className='absolute inset-0 h-full w-full rounded-lg object-fill lg:hidden'
            />
          </div>
        </div>
      </div>
    </section>
  );
}
