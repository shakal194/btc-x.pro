import { useTranslations } from 'next-intl';
import {
  HowWorksRefPageLocalizedImage,
  DiagramRefPageLocalizedImage,
} from '@/components/ui/RefPageLocalizedImage';

export default function HowWorksRefProgramm() {
  const t = useTranslations('referralPage.howWorksRefProgramm');

  return (
    <section className='py-[30px] lg:py-[100px]'>
      <div className='container mx-auto px-4'>
        <div className='mb-12 items-center justify-between md:flex'>
          <h2 className='mb-6 text-font30Leading110 tracking-tight md:w-[500px] lg:w-[753px] lg:text-font50Leading110'>
            {t('title')}
          </h2>
          <div className='my-[20px] border-t border-white opacity-[33%] md:hidden'></div>
          <p className='font-ibm text-ibm13Leading130 opacity-[33%] md:w-[230px] md:text-ibm16Leading130 lg:w-[395px]'>
            {t('subtitle')}
          </p>
        </div>
        <div className='rounded-3xl bg-white text-black'>
          <div className='flex flex-col-reverse justify-between gap-2 px-[10px] py-[20px] md:gap-4 lg:flex-row lg:gap-8 lg:px-[40px] lg:py-[40px]'>
            <p className='mt-[20px] text-[13px] leading-[130%] opacity-[33%] lg:hidden'>
              {t('subtitle_details')}
            </p>
            <div className='mx-auto'>
              <DiagramRefPageLocalizedImage />
            </div>
            <div>
              <div className='flex h-full flex-col justify-between'>
                <div>
                  <h2 className='text-[18px] font-semibold leading-[120%] lg:text-[40px]'>
                    {t('levels_title')}
                  </h2>
                  <div className='my-[20px] border-t border-black opacity-[33%] xl:my-[40px]'></div>
                  <ul>
                    <li className='relative pl-5 text-[13px] leading-[130%] md:text-font16Leading120 lg:text-font22Leading120'>
                      <span className='absolute left-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#FE9900]'></span>
                      <span className='text-[#FE9900]'>
                        {t('first_level_percentage')}
                      </span>{' '}
                      {t('first_level_description')}
                    </li>
                    <li className='relative pl-5 text-[13px] leading-[130%] md:text-font16Leading120 lg:text-font22Leading120'>
                      <span className='absolute left-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#FE9900]'></span>
                      <span className='text-[#FE9900]'>
                        {t('second_level_percentage')}
                      </span>{' '}
                      {t('second_level_description')}
                    </li>
                  </ul>
                </div>
                <p className='hidden text-font16Leading120 opacity-[33%] lg:block lg:w-[338px]'>
                  {t('subtitle_details')}
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
                  {t('company_statement')}
                </p>
                <div className='my-[20px] border-t opacity-[33%] lg:hidden'></div>
                <h2 className='text-right text-font30Leading110 tracking-tight md:w-[450px] lg:mb-4 lg:w-auto lg:text-left lg:text-font50Leading110'>
                  {t('more_info_title')}
                </h2>
              </div>
              <div className='my-[40px] hidden border-t opacity-[33%] md:block'></div>
              <div className='grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4 lg:grid-cols-1 lg:gap-8'>
                <div className='rounded-lg border border-[#999999] px-[15px] py-[25px] lg:px-[30px] lg:py-[30px]'>
                  <h3 className='mb-[29px] text-font18 leading-[120%] lg:text-[22px]'>
                    {t('payment_info_title')}
                  </h3>
                  <p className='text-white/30'>
                    {t('payment_info.immediate_rewards')}{' '}
                    <span className='text-[#FE9900]'>
                      {t('payment_info.immediate_rewards_2')}
                    </span>{' '}
                    {t('payment_info.payment_details')}{' '}
                    <span className='text-[#FE9900]'>
                      {t('payment_info.payment_details_2')}
                    </span>
                  </p>
                </div>
                <div className='rounded-lg border border-[#999999] px-[15px] py-[25px] lg:px-[30px] lg:py-[30px]'>
                  <h3 className='mb-[29px] text-font18 leading-[120%] lg:text-[22px]'>
                    {t('tracking_title')}
                  </h3>
                  <p className='text-white/30'>
                    {t('tracking_info.overview')}{' '}
                    <span className='text-[#FE9900]'>
                      {t('tracking_info.overview_2')}
                    </span>{' '}
                  </p>
                  <p className='text-white/30'>
                    {t('tracking_info.detailed_tracking')}{' '}
                    <span className='text-[#FE9900]'>
                      {t('tracking_info.detailed_tracking_2')}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <HowWorksRefPageLocalizedImage />
        </div>
      </div>
    </section>
  );
}
