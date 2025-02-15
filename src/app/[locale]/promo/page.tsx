import Image from 'next/image';
import { useTranslations } from 'next-intl';
import SubscriptionFormPromo from '@/components/ui/SubscriptionFormPromo';

export default function Promo() {
  const t = useTranslations('promo');

  return (
    <main>
      <section className='bg-black py-[25px] lg:py-[100px]'>
        <div className='container relative mx-auto px-4 text-white'>
          <h2 className='mb-[20px] text-center text-xl font-bold'>
            {t('title')} № 1
          </h2>

          <div className='items-center justify-between gap-4 lg:flex'>
            <div className='w-full lg:w-1/2'>
              <h1 className='mb-4 text-2xl text-font18Leading130 lg:mb-[20px] lg:text-font30Leading130'>
                {t('hero_title')}{' '}
                <span className='text-[#FE9900]'>100 USDT</span>
              </h1>
              <p>
                {t('hero_subtitle')}{' '}
                <span className='text-[#FE9900]'>{t('hero_subtitle2')}</span>{' '}
                {t('hero_subtitle3')}{' '}
                <span className='text-[#FE9900]'>{t('hero_subtitle4')}</span>
                {t('hero_subtitle5')}
              </p>
            </div>
            <div>
              <Image
                src='/promo1.png'
                alt='Promo 1'
                width={630}
                height={284}
                priority={true}
              />
            </div>
          </div>

          <SubscriptionFormPromo />

          {/*<form className='rounded-2xl border border-orange-500 p-4 lg:p-10'>
            <div className='grid grid-cols-1 gap-2 md:gap-4 lg:gap-8'>
             
              <div className='grid gap-8'>
                <div className='grid grid-cols-1 items-center gap-2 md:gap-4 xl:grid-cols-2'>
                  <div className='grid grid-cols-7 items-center gap-2 md:flex md:gap-4 lg:gap-8 xl:grid xl:grid-cols-8'>
                    <div className='flex h-[40px] w-[40px] items-center justify-center rounded-full border border-white/30 lg:h-[65px] lg:w-[65px]'>
                      <p className='text-font18Leading130 lg:text-font30Leading130'>
                        01
                      </p>
                    </div>
                    <div className='col-span-6'>
                      <label className='text-font18Leading130 lg:text-font30Leading130'>
                        {t('form_label_1')}
                      </label>
                    </div>
                  </div>
                  <div className='grid grid-cols-2 items-center gap-2 md:gap-4 lg:gap-8'>
                    <StoreButtons theme='dark' />
                  </div>
                </div>
                <div className='grid grid-cols-1 items-center gap-2 md:gap-4 xl:grid-cols-2'>
                  <div className='flex items-center gap-2 md:gap-4 lg:gap-8'>
                    <div className='flex h-[40px] w-[40px] items-center justify-center rounded-full border border-white/30 lg:h-[65px] lg:w-[65px]'>
                      <p className='text-font18Leading130 lg:text-font30Leading130'>
                        02
                      </p>
                    </div>
                    <div>
                      <label className='text-font18Leading130 lg:mb-[20px] lg:text-font30Leading130'>
                        {t('form_label_2')}
                      </label>
                      <p className='text-gray-400'>{t('form_title_2')}</p>
                    </div>
                  </div>
                  <div className='grid grid-cols-1 items-center gap-2 md:grid-cols-2 md:gap-4 lg:gap-8'>
                    <input
                      type='text'
                      name='youtube'
                      placeholder={t('form_placeholder_2')}
                      className='w-full rounded border border-gray-600 bg-gray-800 p-2 md:w-[350px]'
                      required
                    />
                    <div>
                      <Link
                        href='https://www.youtube.com/@BTC-X'
                        target='_blank'
                        className='block w-full cursor-pointer rounded-lg border-none bg-[#ff6600] p-[10px] text-center hover:bg-[#FD6B06] hover:text-black focus:bg-[#FD6B06] focus:text-black lg:w-[300px]'
                      >
                        {t('form_link_2')}
                      </Link>
                    </div>
                  </div>
                </div>
                <div className='grid grid-cols-1 items-center gap-2 md:gap-4 xl:grid-cols-2'>
                  <div className='flex items-center gap-2 md:gap-4 lg:gap-8'>
                    <div className='flex h-[40px] w-[40px] items-center justify-center rounded-full border border-white/30 lg:h-[65px] lg:w-[65px]'>
                      <p className='text-font18Leading130 lg:text-font30Leading130'>
                        03
                      </p>
                    </div>
                    <div>
                      <label className='text-font18Leading130 lg:mb-[20px] lg:text-font30Leading130'>
                        {t('form_label_3')}
                      </label>
                      <p className='text-gray-400'>{t('form_title_2')}</p>
                    </div>
                  </div>
                  <div className='grid grid-cols-1 items-center gap-2 md:grid-cols-2 md:gap-4 lg:gap-8'>
                    <input
                      type='text'
                      name='telegram'
                      placeholder={t('form_placeholder_3')}
                      className='w-full rounded border border-gray-600 bg-gray-800 p-2 md:w-[350px]'
                      required
                    />
                    <div>
                      <Link
                        href='https://t.me/+7_3pToHuJwJhZTVi'
                        target='_blank'
                        className='block w-full cursor-pointer rounded-lg border-none bg-[#ff6600] p-[10px] text-center hover:bg-[#FD6B06] hover:text-black focus:bg-[#FD6B06] focus:text-black lg:w-[300px]'
                      >
                        {t('form_link_3')}
                      </Link>
                    </div>
                  </div>
                </div>
                <div className='grid grid-cols-1 items-center gap-2 md:gap-4 xl:grid-cols-2'>
                  <div className='flex items-center gap-2 md:gap-4 lg:gap-8'>
                    <div className='flex h-[40px] w-[40px] items-center justify-center rounded-full border border-white/30 lg:h-[65px] lg:w-[65px]'>
                      <p className='text-font18Leading130 lg:text-font30Leading130'>
                        04
                      </p>
                    </div>
                    <div>
                      <label className='text-font18Leading130 lg:mb-[20px] lg:text-font30Leading130'>
                        {t('form_label_4')}
                      </label>
                      <p className='text-gray-400'>{t('form_title_2')}</p>
                    </div>
                  </div>
                  <div className='grid grid-cols-1 items-center gap-2 md:grid-cols-2 md:gap-4 lg:gap-8'>
                    <input
                      type='text'
                      name='instagram'
                      placeholder={t('form_placeholder_4')}
                      className='w-full rounded border border-gray-600 bg-gray-800 p-2 md:w-[350px]'
                      required
                    />
                    <div>
                      <Link
                        href='https://www.instagram.com/btc_x.pro'
                        target='_blank'
                        className='block w-full cursor-pointer rounded-lg border-none bg-[#ff6600] p-[10px] text-center hover:bg-[#FD6B06] hover:text-black focus:bg-[#FD6B06] focus:text-black lg:w-[300px]'
                      >
                        {t('form_link_4')}
                      </Link>
                    </div>
                  </div>
                </div>
                <div className='grid grid-cols-1 items-center gap-2 md:gap-4 xl:grid-cols-2'>
                  <div className='flex items-center gap-2 md:gap-4 lg:gap-8'>
                    <div className='flex h-[40px] w-[40px] items-center justify-center rounded-full border border-white/30 lg:h-[65px] lg:w-[65px]'>
                      <p className='text-font18Leading130 lg:text-font30Leading130'>
                        05
                      </p>
                    </div>
                    <div>
                      <label className='text-font18Leading130 lg:mb-[20px] lg:text-font30Leading130'>
                        {t('form_label_5')}
                      </label>
                      <p className='text-gray-400'>{t('form_title_2')}</p>
                    </div>
                  </div>
                  <div className='grid grid-cols-1 items-center gap-2 md:grid-cols-2 md:gap-4 lg:gap-8'>
                    <input
                      type='text'
                      name='rating'
                      placeholder={t('form_placeholder_5')}
                      className='w-full rounded border border-gray-600 bg-gray-800 p-2 md:w-[350px]'
                      required
                    />
                    <div>
                      <Link
                        href='https://onelink.to/js2s8h'
                        target='_blank'
                        className='block w-full cursor-pointer rounded-lg border-none bg-[#ff6600] p-[10px] text-center hover:bg-[#FD6B06] hover:text-black focus:bg-[#FD6B06] focus:text-black lg:w-[300px]'
                      >
                        {t('form_link_5')}
                      </Link>
                    </div>
                  </div>
                </div>
                <div className='grid grid-cols-1 items-center gap-2 md:gap-4 xl:grid-cols-2'>
                  <div className='flex items-center gap-2 md:gap-4 lg:gap-8'>
                    <div className='flex h-[40px] w-[40px] items-center justify-center rounded-full border border-white/30 lg:h-[65px] lg:w-[65px]'>
                      <p className='text-font18Leading130 lg:text-font30Leading130'>
                        06
                      </p>
                    </div>
                    <div>
                      <label className='text-font18Leading130 lg:text-font30Leading130'>
                        {t('form_label_6')}
                      </label>
                    </div>
                  </div>
                  <div className='grid grid-cols-1 items-center gap-2 md:grid-cols-2 md:gap-4 lg:gap-8'>
                    <input
                      type='email'
                      name='email'
                      placeholder={t('form_placeholder_6')}
                      className='w-full rounded border border-gray-600 bg-gray-800 p-2 md:w-[350px]'
                      required
                    />
                    <div>
                      <button
                        type='submit'
                        className='block w-full cursor-pointer rounded-lg border-none bg-[#ff6600] p-[10px] text-center hover:bg-[#FD6B06] hover:text-black focus:bg-[#FD6B06] focus:text-black lg:w-[300px]'
                      >
                        {t('form_button_6')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>*/}

          {/** Conditions */}
          <div className='mt-6 rounded-2xl border border-orange-500 p-6'>
            <h3 className='text-font18Leading130 text-lg lg:mb-[20px] lg:text-font30Leading130'>
              {t('terms')}
            </h3>
            <ul className='mt-2 list-inside list-disc space-y-2 text-gray-400'>
              <li>{t('terms_conent1')}</li>
              <li>{t('terms_conent2')}</li>
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
