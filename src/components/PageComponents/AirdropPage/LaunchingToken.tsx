import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import StoreButtons from '@/components/ui/StoreButtons';
import TradeVolumeTimer from '@/components/ui/TokenTimer';
import OnlineStatus from '@/components/ui/LiveComponent';
import SliderAboutUsLaunchToken from '@/components/ui/SliderAboutUsLaunchToken';
//import SplineCoin3D from '@/_components/ui/SplineCoin3D';

export default function LaunchingTokenSection() {
  const t = useTranslations('airdrop.launchingToken');

  return (
    <section className='py-[30px] xl:py-[100px]'>
      <div className='container mx-auto px-4'>
        <div className='mb-12 justify-between lg:flex'>
          <p className='mb-[10px] w-[110px] font-ibm text-[10px] text-ibm13Leading130 opacity-[33%] lg:mb-0 lg:w-[180px] lg:text-ibm16Leading130'>
            {t('subtitle')}
          </p>
          <h2 className='mb-6 w-[294px] text-font18 leading-[125%] tracking-tight lg:w-[664px] lg:text-font30Leading110 xl:text-[40px] xl:font-semibold xl:text-white/30'>
            {t('title')}{' '}
            <span className='bg-gradient-to-r from-[#FFC996] via-[#FD6B06] to-[#963706] bg-clip-text text-transparent'>
              {t('daily_trading_volume')}
            </span>
          </h2>
        </div>
        <div className='my-[20px] border-t opacity-[33%] xl:my-[40px]'></div>
        <div className='mb-[20px] flex'>
          <div className='mr-[15px] flex items-center justify-center rounded-full border border-white/30 px-[20px] py-[10px]'>
            <p className='text-[10px] leading-[120%] lg:text-font16Leading110'>
              {t('trading_volume_text')}
            </p>
          </div>
          <OnlineStatus />
          {/*<div className='flex items-center'>
            <Image
              src='/live_icon.svg'
              alt='Live Icon'
              width={6}
              height={6}
              className='h-[6px] w-[6px]'
            ></Image>
            <p className='ml-[3px] font-ibm text-ibm13Leading130 leading-[130%] tracking-tight text-[#69DF40] lg:text-ibm16Leading130'>
              {t('live_status')}
            </p>
          </div>*/}
        </div>
        <div
          id='volume-timer'
          className='mb-[100px] text-center text-[60px] font-bold leading-[110%] tracking-tight lg:text-[145px] xl:text-[220px]'
        >
          <TradeVolumeTimer />
        </div>
        {/*<SplineCoin3D />*/}
        {/*<div className='mb-[100px] text-center'>
          <h2 className='text-[60px] font-bold leading-[110%] tracking-tight lg:text-[145px] xl:text-[220px]'>
            {t('current_data')}
          </h2>
        </div>*/}
        <div className='mx-auto mb-[120px] flex flex-col items-center text-center font-medium lg:w-[950px] xl:mb-[320px] xl:w-[1126px]'>
          <p className='mb-[33px] hidden w-[257px] font-ibm text-ibm13Leading130 opacity-[33%] lg:block lg:text-ibm16Leading130'>
            {t('all_markets_in_one_place')}
          </p>
          <h3 className='text-[18px] leading-[125%] tracking-tight lg:text-[40px]'>
            {t('cta_title')} {t('cta_subtitle_1')}{' '}
            <span className='bg-gradient-to-r from-[#FFC996] via-[#FD6B06] to-[#963706] bg-clip-text text-transparent'>
              {t('cta_subtitle_2')}
            </span>{' '}
            {t('cta_subtitle_3')}
          </h3>
        </div>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
          <div className='rounded-xl shadow-lg xl:px-[45px] xl:py-[60px]'>
            <p className='mb-[10px] w-[114px] font-ibm text-ibm13Leading130 opacity-[33%] lg:w-[250px] lg:text-ibm16Leading130 xl:mb-[24px]'>
              {t('price_formation_title')}
            </p>
            <h2 className='mb-4 text-font30Leading110 lg:text-font50Leading110'>
              {t('price_formation_text')}
            </h2>
            <div className='my-[20px] border-t opacity-[33%] xl:my-[40px]'></div>
            <div className='space-y-6'>
              <div className='mb-5 xl:p-[30px]'>
                <p className='text-[13px] leading-[130%] text-white/30 xl:text-font18'>
                  {t('price_formation_details')}
                </p>
                <div className='mt-5 hidden justify-evenly lg:flex'>
                  <StoreButtons theme='dark' />
                </div>
              </div>
            </div>
          </div>
          {/* Image Section */}
          <div className='relative mb-[90px] h-[500px] lg:h-[700px] xl:mb-[200px]'>
            <div className='absolute left-1/2 top-1 w-full -translate-x-1/2 transform text-center md:w-[407px] xl:top-10'>
              <h3 className='mb-[4px] text-font18 font-semibold leading-[125%] tracking-tight md:text-[20px]'>
                {t('airdrop_info_title')}
              </h3>
              <p className='mx-auto w-[274px] text-[13px] leading-[130%] text-white/50 md:text-font16Leading130 lg:w-[407px]'>
                {t('airdrop_info_text')}
              </p>
            </div>
            {/* Фоновое изображение */}
            <Image
              src='/airdrop_diagram.png'
              alt='Airdrop diagram'
              width={679}
              height={779}
              className='rounded-lg'
            />
          </div>
        </div>
        <div className='mb-[90px] grid grid-cols-1 gap-8 md:grid-cols-2 xl:mb-[200px]'>
          {/* Image Section */}
          <div className='relative'>
            {/* Фоновое изображение */}
            <Image
              src='/airdrop_btcxtoken.png'
              alt='BTCXT Token'
              width={620}
              height={600}
              className='hidden rounded-lg lg:block'
            />
          </div>
          <div className='flex flex-col justify-between rounded-xl'>
            <div>
              <h3 className='text-[28px] font-semibold leading-[110%] tracking-tight xl:text-[50px] xl:leading-[120%]'>
                {t('earn_with_us_title')}
              </h3>
              <div className='my-[20px] border-t border-white opacity-[33%] xl:my-[40px]'></div>
              <p className='text-[13px] leading-[130%] text-white/30 xl:text-font18 xl:leading-[120%]'>
                {t('earn_with_us_text')}
              </p>
              <Image
                src='/airdrop_btcxt_token_mobile.png'
                alt='BTCXT Token'
                width={300}
                height={145}
                className='mt-[25px] w-full rounded-lg lg:hidden'
              />
              <Link
                href='https://onelink.to/js2s8h'
                target='_blank'
                rel='noopener noreferrer'
                className='mt-[30px] block w-full rounded-full border px-5 py-3 text-center text-font18 font-bold leading-[110%] transition delay-200 hover:border-[#FD6B06] hover:bg-[#FD6B06] hover:text-white focus:bg-[#FD6B06] focus:text-white lg:hidden'
              >
                {t('cta_link_text')}
              </Link>
            </div>
            <div className='hidden items-center gap-8 lg:flex'>
              <Image
                src='/qr.png'
                alt='QR Code'
                width={169}
                height={169}
                className='hidden md:h-[120px] md:w-[120px] lg:block'
              />
              <div className='hidden lg:block'>
                <h2 className='mb-[40px] text-font30Leading110 xl:text-font50Leading110'>
                  {t('qr_code_title')}
                </h2>
                <p className='w-[250px] font-ibm text-ibm13Leading130 opacity-[33%] lg:text-ibm16Leading130'>
                  {t('qr_code_text')}
                </p>
              </div>
            </div>
          </div>
        </div>
        <SliderAboutUsLaunchToken />
        {/*<div className='relative mx-auto pb-6 text-white before:absolute before:bottom-0 before:left-1/2 before:h-[1px] before:-translate-x-1/2 before:bg-gradient-to-r before:from-[#FE9900] before:via-[#FD6B06] before:to-[#FE9900] xl:before:w-[1440px]'>
          <h1 className='text-center text-font18Leading130 text-white/30 lg:text-font30Leading130'>
            {t('slider_text')}
          </h1>
        </div>*/}
      </div>
    </section>
  );
}
