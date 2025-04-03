'use client';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Button,
} from '@heroui/react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import LocaleSwitcher from '@/components/ui/LocaleSwitcher';

export default function MobileMenu() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const t = useTranslations('header');
  const t_social = useTranslations('footer');
  const t_mobileMenu = useTranslations('mobileMenu');

  return (
    <>
      <div className='flex lg:hidden'>
        <LocaleSwitcher />
        <Button onPress={onOpen} className='min-w-0 bg-inherit p-0'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='size-6 text-white'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
            />
          </svg>
        </Button>
      </div>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior='inside'
        size='full'
        className='bg-white text-black'
        hideCloseButton
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                <div className='relative z-50'>
                  <div className='container mx-auto'>
                    <div className='flex items-center justify-between rounded-lg border border-gray-400 bg-gradient-to-b from-[#0A1121]/10 to-[#161D32]/0 px-5 backdrop-blur-md'>
                      {/* Логотип */}
                      <div className=''>
                        <Link
                          href='/'
                          rel='noopener noreferrer'
                          className='flex items-center lg:block'
                          onClick={onClose}
                        >
                          <Image
                            src='/logo_header.png' // Замените на путь к вашему логотипу
                            alt='Logo'
                            width={30}
                            height={45}
                            className='h-[26px] w-[17px] cursor-pointer object-contain lg:h-[45px] lg:w-[30px]'
                          />

                          <p className='ml-[5px] text-font18 font-semibold leading-[120%] lg:hidden'>
                            BTC-X
                          </p>
                        </Link>
                      </div>

                      <div className='flex items-center'>
                        <LocaleSwitcher />
                        <Button
                          onPress={onClose}
                          className='min-w-0 bg-inherit p-0'
                        >
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth={1.5}
                            stroke='currentColor'
                            className='size-6'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              d='M6 18 18 6M6 6l12 12'
                            />
                          </svg>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </ModalHeader>
              <ModalBody className='flex flex-col justify-between'>
                <nav className='mt-[90px] flex flex-col gap-2'>
                  <Link
                    href={`/about-us`}
                    onClick={onClose}
                    className='text-[22px] font-semibold leading-[120%] transition delay-200 hover:text-[#FD6B06] focus:text-[#FD6B06]'
                    rel='noopener noreferrer'
                  >
                    {t('aboutus')}
                  </Link>
                  <Link
                    href={`/airdrop`}
                    onClick={onClose}
                    className='text-[22px] font-semibold leading-[120%] transition delay-200 hover:text-[#FD6B06] focus:text-[#FD6B06]'
                    rel='noopener noreferrer'
                  >
                    {t('airdrop')}
                  </Link>
                  <Link
                    href={`/referral`}
                    onClick={onClose}
                    className='text-[22px] font-semibold leading-[120%] transition delay-200 hover:text-[#FD6B06] focus:text-[#FD6B06]'
                    rel='noopener noreferrer'
                  >
                    {t('referral')}
                  </Link>
                  <Link
                    href={`/support`}
                    onClick={onClose}
                    className='text-[22px] font-semibold leading-[120%] transition delay-200 hover:text-[#FD6B06] focus:text-[#FD6B06]'
                    rel='noopener noreferrer'
                  >
                    {t('support')}
                  </Link>
                  <Link
                    href={`/promo`}
                    onClick={onClose}
                    className='text-[22px] font-semibold leading-[120%] transition delay-200 hover:text-[#FD6B06] focus:text-[#FD6B06]'
                    rel='noopener noreferrer'
                  >
                    {t('promo')}
                  </Link>
                  <Link
                    href={`/cloud-mining`}
                    onClick={onClose}
                    className='text-[22px] font-semibold leading-[120%] transition delay-200 hover:text-[#FD6B06] focus:text-[#FD6B06]'
                    rel='noopener noreferrer'
                  >
                    {t('cloudMining')}
                  </Link>
                </nav>
                <div>
                  <div>
                    <div className='my-[20px] border-t lg:opacity-[33%]'></div>
                    <div className='flex items-center justify-between space-x-2 lg:space-x-4'>
                      <p className='w-[106px] font-ibm text-ibm13Leading130 opacity-[33%] lg:hidden'>
                        {t_social('footer_mobile_subtitle')}
                      </p>
                      <div className='grid grid-cols-4 gap-2 md:gap-4'>
                        <Link
                          href='https://www.instagram.com/btc_x.pro'
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          <div className='group relative flex h-[40px] w-[40px] items-center justify-center rounded-full border border-[#FE9900] from-[#FE9900] via-[#FD6B06] to-[#985C00] p-[1px] transition delay-200 hover:bg-gradient-to-r focus:bg-gradient-to-r lg:h-[65px] lg:w-[65px]'>
                            <svg
                              width='14'
                              height='14'
                              viewBox='0 0 14 14'
                              xmlns='http://www.w3.org/2000/svg'
                              fill='currentColor'
                            >
                              <g clipPath='url(#clip0_774_3440)'>
                                <path d='M10.0561 0.335938H3.94124C1.95109 0.335938 0.332031 1.95499 0.332031 3.94514V10.0601C0.332031 12.0502 1.95109 13.6692 3.94124 13.6692H10.0562C12.0463 13.6692 13.6653 12.0502 13.6653 10.0601V3.94514C13.6653 1.95499 12.0463 0.335938 10.0561 0.335938ZM6.99868 10.6483C4.98839 10.6483 3.35296 9.01288 3.35296 7.00259C3.35296 4.9923 4.98839 3.35687 6.99868 3.35687C9.00898 3.35687 10.6444 4.9923 10.6444 7.00259C10.6444 9.01288 9.00898 10.6483 6.99868 10.6483ZM10.7316 4.21665C10.1375 4.21665 9.65432 3.73345 9.65432 3.13938C9.65432 2.5453 10.1375 2.06201 10.7316 2.06201C11.3257 2.06201 11.809 2.5453 11.809 3.13938C11.809 3.73345 11.3257 4.21665 10.7316 4.21665Z' />
                                <path d='M6.99859 4.13672C5.41941 4.13672 4.13452 5.42151 4.13452 7.00079C4.13452 8.57997 5.41941 9.86486 6.99859 9.86486C8.57787 9.86486 9.86266 8.57997 9.86266 7.00079C9.86266 5.42151 8.57787 4.13672 6.99859 4.13672Z' />
                                <path d='M10.7316 2.84375C10.5687 2.84375 10.436 2.9764 10.436 3.13936C10.436 3.30233 10.5687 3.43498 10.7316 3.43498C10.8947 3.43498 11.0274 3.30243 11.0274 3.13936C11.0274 2.9763 10.8947 2.84375 10.7316 2.84375Z' />
                              </g>
                              <defs>
                                <clipPath id='clip0_774_3440'>
                                  <rect
                                    width='13.3333'
                                    height='13.3333'
                                    transform='translate(0.332031 0.335938)'
                                  />
                                </clipPath>
                              </defs>
                            </svg>
                          </div>
                        </Link>
                        <Link
                          href='https://t.me/+7_3pToHuJwJhZTVi'
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          <div className='group relative flex h-[40px] w-[40px] items-center justify-center rounded-full border border-[#FE9900] from-[#FE9900] via-[#FD6B06] to-[#985C00] p-[1px] transition delay-200 hover:bg-gradient-to-r focus:bg-gradient-to-r lg:h-[65px] lg:w-[65px]'>
                            <svg
                              width='14'
                              height='12'
                              viewBox='0 0 14 12'
                              xmlns='http://www.w3.org/2000/svg'
                              fill='currentColor'
                            >
                              <path d='M0.960025 6.15648L4.0269 7.19806L11.308 2.74673C11.4135 2.68218 11.5217 2.82553 11.4307 2.90932L5.91832 7.98317L5.71333 10.8237C5.69772 11.0398 5.95802 11.1601 6.1125 11.0082L7.80974 9.33928L10.9125 11.6881C11.2469 11.9413 11.7312 11.7628 11.8214 11.3532L13.9818 1.54364C14.1051 0.984038 13.5567 0.511829 13.0216 0.716762L0.944421 5.34142C0.565564 5.48651 0.575883 6.02603 0.960025 6.15648Z' />
                            </svg>
                          </div>
                        </Link>
                        <Link
                          href='https://www.youtube.com/@BTC-X'
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          <div className='group relative flex h-[40px] w-[40px] items-center justify-center rounded-full border border-[#FE9900] from-[#FE9900] via-[#FD6B06] to-[#985C00] p-[1px] transition delay-200 hover:bg-gradient-to-r focus:bg-gradient-to-r lg:h-[65px] lg:w-[65px]'>
                            <svg
                              width='14'
                              height='10'
                              viewBox='0 0 14 10'
                              xmlns='http://www.w3.org/2000/svg'
                              fill='currentColor'
                            >
                              <path d='M13.1496 1.13754C12.6683 0.565407 11.7797 0.332031 10.0826 0.332031H3.92243C2.18656 0.332031 1.28291 0.580462 0.803421 1.18958C0.335938 1.78347 0.335938 2.65853 0.335938 3.86962V6.17797C0.335938 8.52425 0.890604 9.71552 3.92243 9.71552H10.0827C11.5543 9.71552 12.3698 9.50958 12.8974 9.00468C13.4384 8.48691 13.6693 7.64154 13.6693 6.17797V3.86962C13.6693 2.59242 13.6331 1.7122 13.1496 1.13754ZM8.89598 5.34248L6.09865 6.80446C6.03611 6.83715 5.96772 6.85336 5.89942 6.85336C5.82209 6.85336 5.74493 6.83255 5.67658 6.79117C5.54789 6.71319 5.46931 6.57371 5.46931 6.42326V3.50868C5.46931 3.35848 5.54768 3.21913 5.67611 3.14111C5.80458 3.06308 5.96437 3.05775 6.09766 3.127L8.89499 4.57956C9.03731 4.65345 9.12669 4.80038 9.12691 4.96068C9.12708 5.12111 9.03809 5.26825 8.89598 5.34248Z' />
                            </svg>
                          </div>
                        </Link>
                        <Link
                          href='https://x.com/btc_x_pro'
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          <div className='group relative flex h-[40px] w-[40px] items-center justify-center rounded-full border border-[#FE9900] from-[#FE9900] via-[#FD6B06] to-[#985C00] p-[1px] transition delay-200 hover:bg-gradient-to-r focus:bg-gradient-to-r lg:h-[65px] lg:w-[65px]'>
                            <svg
                              width='14'
                              height='14'
                              viewBox='0 0 14 14'
                              xmlns='http://www.w3.org/2000/svg'
                              fill='currentColor'
                            >
                              <path d='M8.07703 6.10797L12.2962 1.16797H11.2962L7.6337 5.45714L4.70703 1.16797H1.33203L5.75703 7.65464L1.33203 12.8346H2.33203L6.20037 8.30464L9.2912 12.8346H12.6662L8.07703 6.10797ZM6.70787 7.7113L6.25953 7.06547L2.69203 1.9263H4.22786L7.1062 6.0738L7.55453 6.71964L11.297 12.1113H9.7612L6.70787 7.7113Z' />
                              <rect
                                x='2.46533'
                                y='1.82812'
                                width='0.872451'
                                height='13.2312'
                                transform='rotate(-34.928 2.46533 1.82812)'
                              />
                              <rect
                                x='3.38232'
                                y='1.91797'
                                width='0.872451'
                                height='13.037'
                                transform='rotate(-34.928 3.38232 1.91797)'
                              />
                            </svg>
                          </div>
                        </Link>
                      </div>
                    </div>
                    <div className='my-[20px] border-t lg:opacity-[33%]'></div>
                  </div>
                  <h3 className='text-font30Leading110'>
                    {t_mobileMenu('title')}
                  </h3>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
