import Image from 'next/image';
import Link from 'next/link';

export default function AboutUs() {
  return (
    <div className='bg-black px-4 py-[65px] text-white lg:py-[100px]'>
      <div className='container mx-auto'>
        {/* О нас */}
        <div className='grid grid-cols-1 gap-8 xl:grid-cols-2'>
          <div className='flex items-center justify-between lg:block'>
            <h2 className='text-font30Leading110 lg:mb-6 lg:text-font50Leading110'>
              Про нас
            </h2>
            <p className='w-[106px] font-ibm text-ibm13Leading130 opacity-[33%] lg:w-[250px] lg:text-ibm16Leading130'>
              BTC-X — ваш надійний провідник у світі трейдингу
            </p>
          </div>
          <div className='my-[20px] border-t opacity-[33%] xl:hidden'></div>
          <div className='grid md:grid-cols-2 xl:grid-cols-none'>
            <p className='font16Leading120 mb-[30px] lg:text-font30Leading130'>
              Ми відкриті{' '}
              <span className='text-[#FE9900]'>
                для кожного, хто прагне рости,
              </span>{' '}
              розвиватися та залишатися в курсі трендів у світі фінансів і
              крипти.{' '}
            </p>
            <div>
              <Image
                src='/our_team.png'
                alt='Команда BTC-X'
                width={400}
                height={300}
                className='h-[300px] w-[400px] rounded-lg'
              />
              <p className='mt-[10px] text-center font-ibm text-ibm13Leading130 opacity-[33%] lg:w-[250px] lg:text-left lg:text-ibm16Leading130'>
                Команда BTC-X
              </p>
            </div>
          </div>
        </div>
        {/* Наша цель */}
        <div className='mb-[60px] mt-[70px] lg:mt-[148px]'>
          <h2 className='text-[25px] leading-[110%] lg:text-font50Leading110'>
            Наша ціль —{' '}
            <span className='opacity-[33%]'>
              зробити фінансові ринки доступними, зручними та прозорими надаючи,
            </span>{' '}
            чесні умови торгівлі.{' '}
          </h2>
        </div>
        <div className='grid grid-cols-2 gap-8'>
          {/* Image Section */}
          <div>
            {/* Фоновое изображение */}
            <Image
              src='/our_mission.png'
              alt='Our Mission'
              width={670}
              height={700}
              className='hidden rounded-lg xl:block'
            />
            <Image
              src='/airdrop_btcxtoken.png'
              alt='Our Mission'
              width={130}
              height={145}
              className='w-full rounded-lg xl:hidden'
            />
          </div>
          <div className='flex flex-col justify-between rounded-xl shadow-lg lg:px-[45px]'>
            <div>
              <div className='mb-[40px] hidden border-t border-white opacity-[33%] lg:block'></div>
              <p className='text-[13px] leading-[130%] opacity-[33%] lg:text-primary lg:leading-[120%] lg:opacity-100'>
                Почніть свою подорож у світ вигідної торгівлі, завантаживши наш
                додаток із App Store або Google Play. Встановіть його та
                підготуйтеся до нових можливостей.
              </p>
            </div>
            <div className='flex items-center md:gap-4 xl:gap-8'>
              <Image
                src='/qr.png'
                alt='QR Code'
                width={169}
                height={169}
                className='hidden md:h-[120px] md:w-[120px] lg:block'
              />
              <div className='hidden lg:block'>
                <h2 className='mb-[40px] text-font30Leading110 xl:text-font50Leading110'>
                  Заробляй разом з нами{' '}
                </h2>
                <p className='w-[250px] font-ibm text-ibm13Leading130 opacity-[33%] lg:text-ibm16Leading130'>
                  Скануй щоб завантажити
                </p>
              </div>
            </div>
          </div>
        </div>
        <Link
          href='https://onelink.to/js2s8h'
          target='_blank'
          rel='noopener noreferrer'
          className='mt-[30px] block w-full rounded-full border px-5 py-3 text-center text-primary font-bold leading-[110%] transition hover:border-[#FD6B06] hover:bg-[#FD6B06] hover:text-white focus:bg-[#FD6B06] focus:text-white lg:hidden'
        >
          Перейти в додаток
        </Link>
        <div className='container mx-auto mb-[40px] mt-[90px] flex flex-col items-center lg:mt-16'>
          <p className='mb-[6px] w-[106px] text-center font-ibm text-ibm13Leading130 opacity-[33%] lg:mb-[13px] lg:w-[250px] lg:text-ibm16Leading130'>
            Приєднуйся до ком’юніті BTC-X
          </p>
          <h4 className='text-center text-font16Leading120 tracking-tight lg:text-[40px] lg:font-medium lg:leading-[125%]'>
            Долучайся до динамічної спільноти трейдерів та інвесторів, які разом
            створюють нову еру фінансових можливостей
          </h4>
        </div>
        <div className='grid grid-cols-2 gap-4 xl:flex'>
          <div className='relative col-span-2 rounded-lg bg-gradient-to-r from-[#FFFFFF]/15 to-[#FFFFFF]/30 p-[1px]'>
            <div className='relative flex items-center justify-between overflow-hidden rounded-lg bg-[#111111] py-[25px] lg:py-[40px] lg:pr-[30px]'>
              {/* Левая часть: Иконка + Текст */}
              <div className='z-10 flex w-1/2 flex-col items-center'>
                <Link
                  href='https://www.youtube.com/@BTC-X'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <div className='group relative flex h-[70px] w-[70px] items-center justify-center rounded-full border border-[#FE9900] bg-[#111111] from-[#FE9900] via-[#FD6B06] to-[#985C00] p-[1px] hover:bg-gradient-to-r lg:h-[100px] lg:w-[100px]'>
                    <svg
                      width='25'
                      height='18'
                      viewBox='0 0 25 18'
                      fill='currentColor'
                      xmlns='http://www.w3.org/2000/svg'
                      className='hidden text-white transition-colors group-hover:text-black lg:block'
                    >
                      <path d='M24.0256 1.50225C23.1231 0.435242 21.457 0 18.2751 0H6.72468C3.46992 0 1.77556 0.463317 0.876532 1.59931C0 2.70691 0 4.33886 0 6.59753V10.9025C0 15.2783 1.04 17.5 6.72468 17.5H18.2752C21.0345 17.5 22.5635 17.1159 23.5527 16.1743C24.5672 15.2087 25 13.6321 25 10.9025V6.59753C25 4.21557 24.9322 2.57399 24.0256 1.50225ZM16.0501 9.34439L10.8051 12.0709C10.6878 12.1319 10.5596 12.1621 10.4315 12.1621C10.2865 12.1621 10.1419 12.1233 10.0137 12.0462C9.77242 11.9007 9.62508 11.6406 9.62508 11.36V5.92438C9.62508 5.64427 9.77202 5.38437 10.0128 5.23887C10.2537 5.09336 10.5533 5.08341 10.8032 5.21256L16.0482 7.92155C16.3151 8.05936 16.4827 8.33337 16.4831 8.63233C16.4834 8.93152 16.3165 9.20594 16.0501 9.34439Z' />
                    </svg>
                    <svg
                      width='23'
                      height='17'
                      viewBox='0 0 23 17'
                      xmlns='http://www.w3.org/2000/svg'
                      className='text-white transition-colors group-hover:text-black lg:hidden'
                      fill='currentColor'
                    >
                      <path d='M21.4887 2.22301C20.7066 1.2933 19.2626 0.914062 16.5049 0.914062H6.49456C3.67377 0.914062 2.20533 1.31776 1.42617 2.30758C0.666504 3.27265 0.666504 4.69462 0.666504 6.66265V10.4137C0.666504 14.2264 1.56784 16.1622 6.49456 16.1622H16.505C18.8964 16.1622 20.2216 15.8276 21.0789 15.0071C21.9581 14.1657 22.3332 12.792 22.3332 10.4137V6.66265C22.3332 4.58719 22.2744 3.15684 21.4887 2.22301ZM14.5766 9.05605L10.0309 11.4318C9.92928 11.4849 9.81815 11.5112 9.70716 11.5112C9.5815 11.5112 9.45611 11.4774 9.34505 11.4102C9.13593 11.2834 9.00824 11.0568 9.00824 10.8123V6.07611C9.00824 5.83205 9.13558 5.60559 9.34428 5.47881C9.55305 5.35202 9.8127 5.34336 10.0293 5.45589L14.575 7.81629C14.8062 7.93637 14.9515 8.17512 14.9518 8.43561C14.9521 8.69631 14.8075 8.93541 14.5766 9.05605Z' />
                    </svg>
                  </div>
                </Link>
                <h4 className='mb-5 mt-[50px] text-center text-[14px] leading-[120%] text-white lg:text-[22px]'>
                  Ми в Youtube
                </h4>
                <p className='text-center text-[10px] leading-[120%] text-white opacity-[33%] lg:text-[14px]'>
                  Ділимося найкращими порадами та стратегіями
                </p>
              </div>

              {/* Правая часть: Картинка */}

              <Image
                src='/youtube-BTC-X.png'
                alt='Youtube BTC-X'
                width={420}
                height={280}
                className='hidden object-contain lg:block'
              />
              <Image
                src='/youtube-BTC-X_mobile1.png'
                alt='Youtube BTC-X'
                width={300}
                height={327}
                className='absolute -bottom-20 -right-[50px] lg:hidden'
              />
            </div>
          </div>
          <div className='relative rounded-lg bg-gradient-to-r from-[#FFFFFF]/15 to-[#FFFFFF]/30 p-[1px]'>
            <div className='flex h-full w-full flex-col items-center rounded-md bg-[#111111] py-[25px] xl:w-[210px] xl:py-[40px]'>
              <Link
                href='https://t.me/+7_3pToHuJwJhZTVi'
                target='_blank'
                rel='noopener noreferrer'
              >
                <div className='group relative flex h-[70px] w-[70px] items-center justify-center rounded-full border border-[#FE9900] bg-[#111111] from-[#FE9900] via-[#FD6B06] to-[#985C00] p-[1px] hover:bg-gradient-to-r lg:h-[100px] lg:w-[100px]'>
                  <svg
                    width='23'
                    height='19'
                    viewBox='0 0 23 19'
                    xmlns='http://www.w3.org/2000/svg'
                    className='text-white transition-colors group-hover:text-black group-focus:text-black lg:hidden'
                    fill='currentColor'
                  >
                    <path d='M1.06126 9.75476L6.04493 11.4473L17.8767 4.21393C18.0482 4.10903 18.224 4.34197 18.076 4.47813L9.11849 12.7231L8.78538 17.3391C8.76002 17.6902 9.183 17.8857 9.43403 17.6389L12.1921 14.9268L17.234 18.7436C17.7774 19.1551 18.5644 18.8651 18.711 18.1994L22.2217 2.25891C22.4219 1.34955 21.5309 0.58221 20.6613 0.915227L1.0359 8.4303C0.420262 8.66607 0.43703 9.54279 1.06126 9.75476Z' />
                  </svg>
                  <svg
                    width='25'
                    height='22'
                    viewBox='0 0 25 22'
                    fill='currentColor'
                    xmlns='http://www.w3.org/2000/svg'
                    className='hidden text-white transition-colors group-hover:text-black lg:block'
                  >
                    <path d='M0.551269 10.7802L6.30165 12.8261L19.9537 4.083C20.1516 3.95621 20.3544 4.23777 20.1837 4.40234L9.84807 14.3681L9.46371 19.9474C9.43445 20.3719 9.92251 20.6082 10.2122 20.3098L13.3945 17.0317L19.2121 21.6451C19.8391 22.1424 20.7472 21.7919 20.9163 20.9873L24.9671 1.71995C25.1982 0.620807 24.1701 -0.306682 23.1667 0.0958375L0.52201 9.17936C-0.188347 9.46433 -0.168999 10.524 0.551269 10.7802Z' />
                  </svg>
                </div>
              </Link>
              <h4 className='mb-5 mt-[50px] text-[14px] leading-[120%] lg:text-[22px]'>
                Ми в Telegram
              </h4>
              <p className='text-center text-[14px] opacity-[33%]'>
                Спілкуйся з однодумцями та отримуй поради
              </p>
            </div>
          </div>
          <div className='relative rounded-lg bg-gradient-to-r from-[#FFFFFF]/15 to-[#FFFFFF]/30 p-[1px]'>
            <div className='flex h-full w-full flex-col items-center rounded-md bg-[#111111] py-[25px] xl:w-[210px] xl:py-[40px]'>
              <Link
                href='https://t.me/+7_3pToHuJwJhZTVi'
                target='_blank'
                rel='noopener noreferrer'
              >
                <div className='group relative flex h-[70px] w-[70px] items-center justify-center rounded-full border border-[#FE9900] bg-[#111111] from-[#FE9900] via-[#FD6B06] to-[#985C00] p-[1px] hover:bg-gradient-to-r lg:h-[100px] lg:w-[100px]'>
                  <svg
                    width='23'
                    height='23'
                    viewBox='0 0 23 23'
                    xmlns='http://www.w3.org/2000/svg'
                    className='text-white transition-colors group-hover:text-black group-focus:text-black lg:hidden'
                    fill='currentColor'
                  >
                    <path d='M13.2524 10.0509L20.1085 2.02344H18.4835L12.532 8.99333L7.77612 2.02344H2.29175L9.48237 12.5643L2.29175 20.9818H3.91675L10.2028 13.6205L15.2254 20.9818H20.7098L13.2524 10.0509ZM11.0275 12.6564L10.2989 11.6069L4.50175 3.25573H6.99748L11.6748 9.99542L12.4033 11.0449L18.4849 19.8064H15.9891L11.0275 12.6564Z' />
                    <rect
                      x='4.1333'
                      y='3.09375'
                      width='1.41773'
                      height='21.5007'
                      transform='rotate(-34.928 4.1333 3.09375)'
                    />
                    <rect
                      x='5.62329'
                      y='3.23828'
                      width='1.41773'
                      height='21.1851'
                      transform='rotate(-34.928 5.62329 3.23828)'
                    />
                  </svg>
                  <svg
                    width='25'
                    height='23'
                    viewBox='0 0 25 23'
                    xmlns='http://www.w3.org/2000/svg'
                    className='hidden text-white transition-colors group-hover:text-black lg:block'
                    fill='currentColor'
                  >
                    <path d='M19.6875 0H23.5219L15.1469 9.59687L25 22.6562H17.2859L11.2438 14.7344L4.32969 22.6562H0.49375L9.45156 12.3906L0 0H7.91094L13.3719 7.23906L19.6875 0ZM18.3438 20.3562H20.4688L6.75469 2.17969H4.47656L18.3438 20.3562Z' />
                    <rect
                      x='6.8457'
                      y='0.390625'
                      width='24.1721'
                      height='4.25231'
                      transform='rotate(52.5441 6.8457 0.390625)'
                    />
                  </svg>
                </div>
              </Link>
              <h4 className='mb-5 mt-[50px] text-[14px] leading-[120%] lg:text-[22px]'>
                Ми у Twitter
              </h4>
              <p className='text-center text-[14px] opacity-[33%]'>
                Будь у курсі всіх трендів та важливих подій
              </p>
            </div>
          </div>
          <div className='relative rounded-lg bg-gradient-to-r from-[#FFFFFF]/15 to-[#FFFFFF]/30 p-[1px]'>
            <div className='flex h-full w-full flex-col items-center rounded-md bg-[#111111] py-[25px] xl:w-[210px] xl:py-[40px]'>
              <Link
                href='https://www.instagram.com/btc_x.pro'
                target='_blank'
                rel='noopener noreferrer'
              >
                <div className='group relative flex h-[70px] w-[70px] items-center justify-center rounded-full border border-[#FE9900] bg-[#111111] from-[#FE9900] via-[#FD6B06] to-[#985C00] p-[1px] hover:bg-gradient-to-r lg:h-[100px] lg:w-[100px]'>
                  <svg
                    width='23'
                    height='23'
                    viewBox='0 0 23 23'
                    xmlns='http://www.w3.org/2000/svg'
                    className='text-white transition group-hover:text-black group-focus:text-black lg:hidden'
                    fill='currentColor'
                  >
                    <g clipPath='url(#clip0_700_5853)'>
                      <path d='M16.4684 0.667969H6.53171C3.29771 0.667969 0.666748 3.29893 0.666748 6.53293V16.4698C0.666748 19.7036 3.29771 22.3346 6.53171 22.3346H16.4686C19.7024 22.3346 22.3334 19.7036 22.3334 16.4698V6.53293C22.3334 3.29893 19.7024 0.667969 16.4684 0.667969ZM11.5001 17.4256C8.23334 17.4256 5.57576 14.768 5.57576 11.5013C5.57576 8.23456 8.23334 5.57698 11.5001 5.57698C14.7668 5.57698 17.4244 8.23456 17.4244 11.5013C17.4244 14.768 14.7668 17.4256 11.5001 17.4256ZM17.566 6.97412C16.6007 6.97412 15.8155 6.18893 15.8155 5.22356C15.8155 4.25819 16.6007 3.47283 17.566 3.47283C18.5314 3.47283 19.3168 4.25819 19.3168 5.22356C19.3168 6.18893 18.5314 6.97412 17.566 6.97412Z' />
                      <path d='M11.5001 6.84766C8.93389 6.84766 6.84595 8.93544 6.84595 11.5018C6.84595 14.0679 8.93389 16.1559 11.5001 16.1559C14.0664 16.1559 16.1542 14.0679 16.1542 11.5018C16.1542 8.93544 14.0664 6.84766 11.5001 6.84766Z' />
                      <path d='M17.5661 4.74219C17.3012 4.74219 17.0857 4.95774 17.0857 5.22256C17.0857 5.48737 17.3012 5.70293 17.5661 5.70293C17.831 5.70293 18.0466 5.48754 18.0466 5.22256C18.0466 4.95758 17.831 4.74219 17.5661 4.74219Z' />
                    </g>
                  </svg>
                  <svg
                    width='25'
                    height='25'
                    viewBox='0 0 25 25'
                    fill='currentColor'
                    xmlns='http://www.w3.org/2000/svg'
                    className='hidden text-white transition-colors group-hover:text-black lg:block'
                  >
                    <path d='M18.003 0C21.8675 0 25 3.135 25 6.997V18.003C25 21.8675 21.865 25 18.003 25H6.997C3.1325 25 0 21.865 0 18.003V6.997C0 3.1325 3.135 0 6.997 0H18.003ZM12.5 6C8.91 6 6 8.91 6 12.5C6 16.09 8.91 19 12.5 19C16.09 19 19 16.09 19 12.5C19 8.91 16.09 6 12.5 6ZM12.5 8C13.0909 8 13.6761 8.1164 14.2221 8.34254C14.768 8.56869 15.2641 8.90016 15.682 9.31802C16.0998 9.73588 16.4313 10.232 16.6575 10.7779C16.8836 11.3239 17 11.9091 17 12.5C17 13.0909 16.8836 13.6761 16.6575 14.2221C16.4313 14.768 16.0998 15.2641 15.682 15.682C15.2641 16.0998 14.768 16.4313 14.2221 16.6575C13.6761 16.8836 13.0909 17 12.5 17C11.3065 17 10.1619 16.5259 9.31802 15.682C8.47411 14.8381 8 13.6935 8 12.5C8 11.3065 8.47411 10.1619 9.31802 9.31802C10.1619 8.47411 11.3065 8 12.5 8ZM19.75 3.5C19.2859 3.5 18.8408 3.68437 18.5126 4.01256C18.1844 4.34075 18 4.78587 18 5.25C18 5.71413 18.1844 6.15925 18.5126 6.48744C18.8408 6.81563 19.2859 7 19.75 7C20.2141 7 20.6592 6.81563 20.9874 6.48744C21.3156 6.15925 21.5 5.71413 21.5 5.25C21.5 4.78587 21.3156 4.34075 20.9874 4.01256C20.6592 3.68437 20.2141 3.5 19.75 3.5Z' />
                  </svg>
                </div>
              </Link>
              <h4 className='mb-5 mt-[50px] text-[14px] leading-[120%] lg:text-[22px]'>
                Ми в Instagram
              </h4>
              <p className='text-center text-[14px] opacity-[33%]'>
                Слідкуй за нашими оновленнями
              </p>
            </div>
          </div>
          <div className='flex h-full w-full flex-wrap content-end rounded-md xl:hidden'>
            <p className='text-[18px] leading-[125%] opacity-[33%] lg:text-[22px]'>
              Підпишись, у нас цікаво :)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
