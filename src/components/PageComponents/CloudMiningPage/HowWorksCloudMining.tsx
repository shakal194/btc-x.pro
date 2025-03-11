import { useTranslations } from 'next-intl';
import {
  HowWorksRefPageLocalizedImage,
  DiagramCloudMiningPageLocalizedImage,
} from '@/components/ui/CloudMiningPageLocalizedImage';

export default function HowWorksCloudMining() {
  const t = useTranslations('cloudMiningPage.HowWorksCloudMining');

  return (
    <section className='py-[30px] lg:py-[100px]'>
      <div className='container mx-auto px-4'>
        <div className='mb-12 items-center justify-between md:flex'>
          <h2 className='mb-6 text-font30Leading110 tracking-tight md:w-[500px] lg:w-[753px] lg:text-font50Leading110'>
            {t('title')}
          </h2>
          <div className='my-[20px] border-t border-white opacity-[33%] md:hidden'></div>
        </div>
        <div className='rounded-3xl bg-white text-black'>
          <div className='flex flex-col-reverse justify-between gap-2 px-[10px] py-[20px] md:gap-4 lg:flex-row lg:gap-8 lg:px-[40px] lg:py-[40px]'>
            <div className='mx-auto'>
              <DiagramCloudMiningPageLocalizedImage />
            </div>
            <div>
              <div className='flex h-full flex-col justify-between'>
                <div>
                  <h2 className='text-[18px] font-semibold leading-[120%] lg:text-[40px]'>
                    {t('levels_title')}
                  </h2>
                  <div className='my-[20px] border-t border-black opacity-[33%] xl:my-[40px]'></div>
                  <ul className='space-y-2'>
                    <li className='relative pl-5 text-[13px] leading-[130%] md:text-font16Leading120 lg:text-font22Leading120'>
                      <span className='absolute left-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#FE9900]'></span>
                      <span className='mr-2 text-[#FE9900]'>
                        {t('first_level_percentage')}
                      </span>{' '}
                      {t('first_level_description')}
                    </li>
                    <li className='relative pl-5 text-[13px] leading-[130%] md:text-font16Leading120 lg:text-font22Leading120'>
                      <span className='absolute left-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#FE9900]'></span>
                      <span className='mr-2 text-[#FE9900]'>
                        {t('second_level_percentage')}
                      </span>{' '}
                      {t('second_level_description')}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
