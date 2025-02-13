import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { TradePowerLocalizedImage } from '@/components/ui/MainPagePlatformStatsLocalizedImage';

export default function HowItWorksSection() {
  const t = useTranslations('aboutUs.howItWorks');

  return (
    <section className='rounded-b-xl bg-[#F4F4F4] py-[30px] text-black xl:py-[100px]'>
      <div className='container mx-auto px-4'>
        <div className='mb-[90px] grid grid-cols-1 gap-8 lg:grid-cols-2'>
          <h4 className='text-[40px] font-semibold leading-[120%] tracking-tight lg:hidden'>
            {t('title')}
          </h4>
          <div>
            <Image
              src='/about_us_how_it_works.png'
              alt='How it works'
              width={630}
              height={526}
              className='w-full rounded-lg'
            />
          </div>
          <div className='flex h-full flex-col justify-between'>
            <h4 className='hidden text-[40px] font-semibold leading-[120%] tracking-tight lg:block'>
              {t('title')}
            </h4>
            <div className='my-6 hidden border-t border-black opacity-[33%] xl:block'></div>
            <div className='flex h-full flex-col justify-between'>
              <h3 className='text-primary font-semibold leading-[120%]'>
                {t('trade_example_title')}
              </h3>
              <p className='hidden w-[302px] font-ibm text-ibm13Leading130 opacity-[33%] lg:text-ibm16Leading130 xl:block'>
                {t('no_fees_text')}
              </p>
            </div>
          </div>
        </div>

        <div className='space-y-12'>
          {/* Блок 2 */}
          <div className='grid grid-cols-1 items-start gap-8 lg:grid-cols-2'>
            <div className='flex h-full flex-col justify-between'>
              <div className='flex items-center justify-between'>
                <h4 className='text-font30Leading110 lg:text-font50Leading110'>
                  {t('leverage_trading_title')}
                </h4>
              </div>
              <p className='hidden w-[427px] font-ibm text-ibm13Leading130 opacity-[33%] lg:block lg:text-ibm16Leading130'>
                {t('leverage_trading_text')}
              </p>
            </div>
            <div className='xl:w-[655px]'>
              <h3 className='mb-[40px] hidden text-font16Leading120 lg:text-font22Leading120 xl:block'>
                {t('leverage_trading_example_title')}{' '}
                <span className='text-[#FE9900]'>
                  {t('leverage_trading_example_text')}
                </span>{' '}
                {t('leverage_trading_impact_text')}
              </h3>
              <div className='xl:hidden'>
                <TradePowerLocalizedImage />
              </div>
              <p className='mt-[20px] font-ibm text-ibm13Leading130 opacity-[33%] md:text-ibm16Leading130 lg:hidden'>
                {t('leverage_trading_text')}
              </p>
              <Image
                src='/about-us_trading_power.png'
                alt='Cross'
                width={655}
                height={160}
                className='mb-[49px] hidden xl:block'
              />
              <div className='mb-[34px] hidden items-center xl:flex'>
                <div className='mr-[5px] h-[28px] w-[28px] rounded-full bg-[#FE9900]'></div>
                <p className='text-font16Leading120 lg:text-font22Leading120'>
                  {t('investment_amount_text')}
                </p>
              </div>
              <div className='hidden items-center xl:flex'>
                <div className='mr-[5px] h-[28px] w-[28px] rounded-full bg-[#131313]'></div>
                <p className='text-font16Leading120 lg:text-font22Leading120'>
                  {t('trade_amount_with_leverage_text')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
