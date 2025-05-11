import Image from 'next/image';
import { useTranslations } from 'next-intl';
import SubscriptionFormPromo from '@/components/ui/SubscriptionFormPromo';

export default function Promo() {
  const t = useTranslations('promo');

  return (
    <main>
      <section className='bg-black py-[25px]'>
        <div className='container relative mx-auto px-4 text-white'>
          <h2 className='mb-[20px] text-center text-xl font-bold'>
            {t('title')} № 1
          </h2>

          <div className='items-center justify-between gap-4 lg:flex'>
            <div className='w-full lg:w-1/2'>
              <h1 className='mb-4 text-2xl text-font18Leading130 lg:mb-[20px] lg:text-font30Leading130'>
                {t('hero_title')}{' '}
                <span className='text-[#FE9900]'>50 USDT</span>
              </h1>
              <p>
                {t('hero_subtitle')}{' '}
                <span className='text-[#FE9900]'>{t('hero_subtitle2')}</span>{' '}
                {t('hero_subtitle3')}{' '}
                <span className='text-[#FE9900]'>{t('hero_subtitle4')}</span>{' '}
                {t('hero_subtitle5')}
              </p>
            </div>
            <div>
              <Image
                src='/promo_air50.png'
                alt='Promo 1'
                width={630}
                height={284}
                priority={true}
              />
            </div>
          </div>
          <SubscriptionFormPromo />
          {/** Conditions */}
          <div className='mt-6 rounded-2xl border border-orange-500 p-6'>
            <h3 className='text-font18Leading130 text-lg lg:mb-[20px] lg:text-font30Leading130'>
              {t('terms')}
            </h3>
            <ul className='mt-2 list-inside list-disc space-y-2 text-gray-400'>
              <li>{t('terms_conent1')}</li>
              <li>{t('terms_conent2')}</li>
              <li>{t('terms_conent2_1')}</li>
              <li>{t('terms_conent3')}</li>
              <li>{t('terms_conent4')}</li>
              <li>{t('terms_conent5')}</li>
              <li>{t('terms_conent6')}</li>
              <li>{t('terms_conent7')}</li>
              <li>{t('terms_conent8')}</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
