import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function RatingSection() {
  const t = useTranslations('airdrop.rating');

  return (
    <section className='relative z-20 rounded-b-xl bg-[#F4F4F4] py-[100px] text-black'>
      <div className='container mx-auto px-4'>
        <div className='flex flex-col-reverse justify-between md:flex-row md:items-end xl:mb-12'>
          <h2 className='text-font30Leading110 tracking-tight lg:text-font50Leading110 xl:w-[514px]'>
            {t('title')}
          </h2>
          <p className='mb-[10px] w-[179px] font-ibm text-ibm13Leading130 opacity-[33%] md:mb-0 lg:text-ibm16Leading130 xl:w-[250px]'>
            {t('subtitle')}
          </p>
        </div>
        <div className='my-[20px] border-t border-black opacity-[33%] xl:my-[40px]'></div>
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-2 xl:gap-16'>
          <div className='flex flex-col justify-between'>
            <h3 className='text-font16Leading120 text-font22Leading120'>
              {t('title_2')}{' '}
              <span className='text-[#FE9900]'>{t('subtitle_2')}</span>{' '}
              {t('subtitle_2_1')}{' '}
              <span className='text-[#FE9900]'>{t('subtitle_2_2')}</span>{' '}
              {t('subtitle_2_3')}
            </h3>
            <p className='text-ibm hidden text-font16Leading130 text-black/50 lg:block'>
              {t('text')}
            </p>
          </div>
          <div className='xl:w-[608px]'>
            <div className='mb-[20px] flex justify-between'>
              <div className='flex items-center justify-center rounded-full border px-[20px] py-[10px]'>
                <p className='text-font16Leading110'>{t('rank')}</p>
              </div>
              <div className='flex items-center justify-center rounded-full border px-[20px] py-[10px]'>
                <p className='text-font16Leading110'>{t('volume')}</p>
              </div>
            </div>
            <div className='mb-[10px] flex items-center justify-between rounded-full bg-white px-[11px] py-[11px] text-black/30'>
              <div className='flex items-center'>
                <Image
                  src='/bronze.png'
                  alt='Bronze rate'
                  width={30}
                  height={30}
                  className='mr-[4px] h-[30px] w-[30px] object-cover'
                />
                <p>{t('rank_1')}</p>
              </div>
              <div>
                <p>{t('volume_1')}</p>
              </div>
            </div>
            <div className='flex items-center justify-between rounded-full bg-white px-[11px] py-[11px]'>
              <div className='flex items-center'>
                <Image
                  src='/silver.png'
                  alt='Silver rate'
                  width={30}
                  height={30}
                  className='mr-[4px] h-[30px] w-[30px] object-cover'
                />
                <p>{t('rank_2')}</p>
              </div>
              <div>
                <p>{t('volume_2')}</p>
              </div>
            </div>
            <div className='mb-[10px] flex items-center justify-between rounded-full bg-white px-[11px] py-[11px] text-black/30'>
              <div className='flex items-center'>
                <Image
                  src='/gold.png'
                  alt='Gold rate'
                  width={30}
                  height={30}
                  className='mr-[4px] h-[30px] w-[30px] object-cover'
                />
                <p>{t('rank_3')}</p>
              </div>
              <div>
                <p>{t('volume_3')}</p>
              </div>
            </div>
            <div className='mb-[10px] flex items-center justify-between rounded-full bg-white px-[11px] py-[11px] text-black/30'>
              <div className='flex items-center'>
                <Image
                  src='/platinum.png'
                  alt='Platinum rate'
                  width={30}
                  height={30}
                  className='mr-[4px] h-[30px] w-[30px] object-cover'
                />
                <p>{t('rank_4')}</p>
              </div>
              <div>
                <p>{t('volume_4')}</p>
              </div>
            </div>
            <div className='mb-[10px] flex items-center justify-between rounded-full bg-white px-[11px] py-[11px] text-black/30'>
              <div className='flex items-center'>
                <Image
                  src='/diamond.png'
                  alt='Diamond rate'
                  width={30}
                  height={30}
                  className='mr-[4px] h-[30px] w-[30px] object-cover'
                />
                <p>{t('rank_5')}</p>
              </div>
              <div>
                <p>{t('volume_5')}</p>
              </div>
            </div>
            <div className='mb-[10px] flex items-center justify-between rounded-full bg-white px-[11px] py-[11px] text-black/30'>
              <div className='flex items-center'>
                <Image
                  src='/epic.png'
                  alt='Epic rate'
                  width={30}
                  height={30}
                  className='mr-[4px] h-[30px] w-[30px] object-cover'
                />
                <p>{t('rank_6')}</p>
              </div>
              <div>
                <p>{t('volume_6')}</p>
              </div>
            </div>
            <div className='mb-[10px] flex items-center justify-between rounded-full bg-white px-[11px] py-[11px] text-black/30'>
              <div className='flex items-center'>
                <div className='flex'>
                  <Image
                    src='/epic.png'
                    alt='Legendary rate'
                    width={30}
                    height={30}
                    className='mr-[4px] h-[30px] w-[30px] object-cover'
                  />
                  <Image
                    src='/epic.png'
                    alt='Legendary rate'
                    width={30}
                    height={30}
                    className='mr-[4px] h-[30px] w-[30px] object-cover'
                  />
                </div>
                <p>{t('rank_7')}</p>
              </div>
              <div>
                <p>{t('volume_7')}</p>
              </div>
            </div>
            <div className='mb-[10px] flex items-center justify-between rounded-full bg-white px-[11px] py-[11px] text-black/30'>
              <div className='flex items-center'>
                <div className='flex'>
                  <Image
                    src='/epic.png'
                    alt='Master rate'
                    width={30}
                    height={30}
                    className='mr-[4px] h-[30px] w-[30px] object-cover'
                  />
                  <Image
                    src='/epic.png'
                    alt='Master rate'
                    width={30}
                    height={30}
                    className='mr-[4px] h-[30px] w-[30px] object-cover'
                  />
                  <Image
                    src='/epic.png'
                    alt='Master rate'
                    width={30}
                    height={30}
                    className='mr-[4px] h-[30px] w-[30px] object-cover'
                  />
                </div>
                <p>{t('rank_8')}</p>
              </div>
              <div>
                <p>{t('volume_8')}</p>
              </div>
            </div>
            <div className='mb-[10px] flex items-center justify-between rounded-full bg-white px-[11px] py-[11px] text-black/30'>
              <div className='flex items-center'>
                <Image
                  src='/grandmaster.png'
                  alt='Grandmaster rate'
                  width={30}
                  height={30}
                  className='mr-[4px] h-[30px] w-[30px] object-cover'
                />
                <p>{t('rank_9')}</p>
              </div>
              <div>
                <p>{t('volume_9')}</p>
              </div>
            </div>
          </div>
          <p className='text-ibm block text-[10px] text-font16Leading130 leading-[130%] text-black/50 lg:hidden'>
            {t('text')}
          </p>
        </div>
      </div>
    </section>
  );
}
