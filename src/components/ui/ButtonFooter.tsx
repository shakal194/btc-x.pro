import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function ButtonFooter() {
  const t = useTranslations('footer_button');

  return (
    <>
      <Link
        href='https://onelink.to/js2s8h'
        target='_blank'
        rel='noopener noreferrer'
        className='group sticky bottom-0 left-1/2 z-50 flex w-[210px] -translate-x-1/2 items-center justify-between rounded-full bg-[#1F1F1F] p-[7px] md:w-[263px] lg:w-[394px] lg:p-[10px]'
      >
        <div className='ml-[13px] flex items-center lg:ml-[23px]'>
          <Image
            src='/logo_header.png'
            alt='Logo'
            width={30}
            height={45}
            className='mr-[10px] h-[30px] w-[20px] lg:h-[45px] lg:w-[30px]'
          />
          <p className='group-transition hidden text-[16px] font-semibold leading-[100%] text-white delay-200 hover:text-[#FD6B06] md:block lg:text-font30Leading130'>
            {t('title')}
          </p>
        </div>

        <p className='delay-200group-transition group-transition rounded-full bg-[#FE9900] px-[12px] py-[8px] text-[16px] font-semibold leading-[100%] text-black transition delay-200 hover:bg-[#FD6B06] hover:text-white group-focus:bg-[#FD6B06] group-focus:text-white lg:px-5 lg:py-3 lg:text-primary lg:leading-[130%]'>
          {t('description')}
        </p>
      </Link>
    </>
  );
}
