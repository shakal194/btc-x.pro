import Image from 'next/image';
import Link from 'next/link';

export default function ButtonFooter() {
  return (
    <>
      <Link
        href='https://onelink.to/js2s8h'
        target='_blank'
        rel='noopener noreferrer'
        className='group sticky bottom-0 left-1/2 z-50 flex w-[177px] -translate-x-1/2 items-center justify-between rounded-full bg-[#1F1F1F] p-[7px] lg:w-[354px] lg:p-[10px]'
      >
        <div className='ml-[13px] flex lg:ml-[23px]'>
          <Image
            src='/logo_header.png'
            alt='Logo'
            width={30}
            height={45}
            className='mr-[10px] h-[30px] w-[20px] lg:h-[45px] lg:w-[30px]'
          />
          <p className='hidden text-font18Leading130 text-white group-hover:text-[#FD6B06] lg:block lg:text-font30Leading130'>
            BTC-X
          </p>
        </div>

        <p className='rounded-full bg-[#FE9900] px-[12px] py-[8px] text-[16px] font-semibold leading-[100%] text-black transition group-hover:bg-[#FD6B06] group-hover:text-white group-focus:bg-[#FD6B06] group-focus:text-white lg:px-5 lg:py-3 lg:text-primary lg:font-bold lg:leading-[130%]'>
          Приєднуйся
        </p>
      </Link>
    </>
  );
}
