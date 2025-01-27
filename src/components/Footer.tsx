import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className='bg-black py-[70px] text-white'>
      <div className='container mx-auto mb-[40px] flex w-[1340px] items-baseline justify-between px-5 py-3'>
        {/* Левый блок с ссылками */}
        <div className='flex items-center space-x-6'>
          <Link
            href='#'
            className='text-primary leading-[110%] transition hover:text-[#FD6B06] focus:text-[#FD6B06]'
            rel='noopener noreferrer'
          >
            Про нас
          </Link>
          <Link
            href='./referral'
            className='text-primary leading-[110%] transition hover:text-[#FD6B06] focus:text-[#FD6B06]'
            rel='noopener noreferrer'
          >
            Реферальна програма
          </Link>
          <Link
            href='#'
            className='text-primary leading-[110%] transition hover:text-[#FD6B06] focus:text-[#FD6B06]'
            rel='noopener noreferrer'
          >
            Airdrop
          </Link>{' '}
          <Link
            href='#'
            className='text-primary leading-[110%] transition hover:text-[#FD6B06] focus:text-[#FD6B06]'
            rel='noopener noreferrer'
          >
            Підтримка
          </Link>
        </div>

        {/* Правый блок с кнопками */}
        <div className='flex items-center space-x-4'>
          <Link
            href='https://www.instagram.com/btc_x.pro'
            target='_blank'
            rel='noopener noreferrer'
          >
            <div className='group relative flex h-[65px] w-[65px] items-center justify-center rounded-full border border-[#FE9900] bg-[#111111] from-[#FE9900] via-[#FD6B06] to-[#985C00] p-[1px] hover:bg-gradient-to-r focus:bg-gradient-to-r'>
              <svg
                width='23'
                height='23'
                viewBox='0 0 23 23'
                xmlns='http://www.w3.org/2000/svg'
                className='text-white transition group-hover:text-black group-focus:text-black'
                fill='currentColor'
              >
                <g clipPath='url(#clip0_700_5853)'>
                  <path d='M16.4684 0.667969H6.53171C3.29771 0.667969 0.666748 3.29893 0.666748 6.53293V16.4698C0.666748 19.7036 3.29771 22.3346 6.53171 22.3346H16.4686C19.7024 22.3346 22.3334 19.7036 22.3334 16.4698V6.53293C22.3334 3.29893 19.7024 0.667969 16.4684 0.667969ZM11.5001 17.4256C8.23334 17.4256 5.57576 14.768 5.57576 11.5013C5.57576 8.23456 8.23334 5.57698 11.5001 5.57698C14.7668 5.57698 17.4244 8.23456 17.4244 11.5013C17.4244 14.768 14.7668 17.4256 11.5001 17.4256ZM17.566 6.97412C16.6007 6.97412 15.8155 6.18893 15.8155 5.22356C15.8155 4.25819 16.6007 3.47283 17.566 3.47283C18.5314 3.47283 19.3168 4.25819 19.3168 5.22356C19.3168 6.18893 18.5314 6.97412 17.566 6.97412Z' />
                  <path d='M11.5001 6.84766C8.93389 6.84766 6.84595 8.93544 6.84595 11.5018C6.84595 14.0679 8.93389 16.1559 11.5001 16.1559C14.0664 16.1559 16.1542 14.0679 16.1542 11.5018C16.1542 8.93544 14.0664 6.84766 11.5001 6.84766Z' />
                  <path d='M17.5661 4.74219C17.3012 4.74219 17.0857 4.95774 17.0857 5.22256C17.0857 5.48737 17.3012 5.70293 17.5661 5.70293C17.831 5.70293 18.0466 5.48754 18.0466 5.22256C18.0466 4.95758 17.831 4.74219 17.5661 4.74219Z' />
                </g>
                <defs>
                  <clipPath id='clip0_700_5853'>
                    <rect
                      width='21.6667'
                      height='21.6667'
                      transform='translate(0.666748 0.667969)'
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
            <div className='group relative flex h-[65px] w-[65px] items-center justify-center rounded-full border border-[#FE9900] bg-[#111111] from-[#FE9900] via-[#FD6B06] to-[#985C00] p-[1px] hover:bg-gradient-to-r focus:bg-gradient-to-r'>
              <svg
                width='23'
                height='19'
                viewBox='0 0 23 19'
                xmlns='http://www.w3.org/2000/svg'
                className='text-white transition-colors group-hover:text-black group-focus:text-black'
                fill='currentColor'
              >
                <path d='M1.06126 9.75476L6.04493 11.4473L17.8767 4.21393C18.0482 4.10903 18.224 4.34197 18.076 4.47813L9.11849 12.7231L8.78538 17.3391C8.76002 17.6902 9.183 17.8857 9.43403 17.6389L12.1921 14.9268L17.234 18.7436C17.7774 19.1551 18.5644 18.8651 18.711 18.1994L22.2217 2.25891C22.4219 1.34955 21.5309 0.58221 20.6613 0.915227L1.0359 8.4303C0.420262 8.66607 0.43703 9.54279 1.06126 9.75476Z' />
              </svg>
            </div>
          </Link>
          <Link
            href='https://www.youtube.com/@BTC-X'
            target='_blank'
            rel='noopener noreferrer'
          >
            <div className='group relative flex h-[65px] w-[65px] items-center justify-center rounded-full border border-[#FE9900] bg-[#111111] from-[#FE9900] via-[#FD6B06] to-[#985C00] p-[1px] hover:bg-gradient-to-r focus:bg-gradient-to-r'>
              <svg
                width='23'
                height='17'
                viewBox='0 0 23 17'
                xmlns='http://www.w3.org/2000/svg'
                className='text-white transition-colors group-hover:text-black group-focus:text-black'
                fill='currentColor'
              >
                <path d='M21.4887 2.22301C20.7066 1.2933 19.2626 0.914062 16.5049 0.914062H6.49456C3.67377 0.914062 2.20533 1.31776 1.42617 2.30758C0.666504 3.27265 0.666504 4.69462 0.666504 6.66265V10.4137C0.666504 14.2264 1.56784 16.1622 6.49456 16.1622H16.505C18.8964 16.1622 20.2216 15.8276 21.0789 15.0071C21.9581 14.1657 22.3332 12.792 22.3332 10.4137V6.66265C22.3332 4.58719 22.2744 3.15684 21.4887 2.22301ZM14.5766 9.05605L10.0309 11.4318C9.92928 11.4849 9.81815 11.5112 9.70716 11.5112C9.5815 11.5112 9.45611 11.4774 9.34505 11.4102C9.13593 11.2834 9.00824 11.0568 9.00824 10.8123V6.07611C9.00824 5.83205 9.13558 5.60559 9.34428 5.47881C9.55305 5.35202 9.8127 5.34336 10.0293 5.45589L14.575 7.81629C14.8062 7.93637 14.9515 8.17512 14.9518 8.43561C14.9521 8.69631 14.8075 8.93541 14.5766 9.05605Z' />
              </svg>
            </div>
          </Link>
          <Link
            href='https://www.instagram.com/btc_x.pro'
            target='_blank'
            rel='noopener noreferrer'
          >
            <div className='group relative flex h-[65px] w-[65px] items-center justify-center rounded-full border border-[#FE9900] bg-[#111111] from-[#FE9900] via-[#FD6B06] to-[#985C00] p-[1px] hover:bg-gradient-to-r focus:bg-gradient-to-r'>
              <svg
                width='23'
                height='23'
                viewBox='0 0 23 23'
                xmlns='http://www.w3.org/2000/svg'
                className='text-white transition-colors group-hover:text-black group-focus:text-black'
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
            </div>
          </Link>
        </div>
      </div>
      <div className='mb-[60px] border-[0.5px] border-white opacity-[20%]'></div>
      <div className='container mx-auto w-[1340px] px-4'>
        {/* Верхний блок */}
        <div className='mb-8 flex flex-col items-start justify-between border-b border-gray-800 pb-8 md:flex-row md:items-center'>
          {/* Логотип и информация о компании */}
          <div className='mb-6 flex items-start md:mb-0'>
            <div className='mr-[30px] flex flex-col items-center'>
              <Image
                src='/logo_footer.png' // Замените на путь к вашему логотипу
                alt='BTC-X.PRO, LLC'
                width={140}
                height={140}
              />
              <p className='mt-[30px] text-[16px] leading-[130%]'>
                ТОВ &quot;ВТС-Х&quot;
              </p>
            </div>
            <div className='w-[521px]'>
              <p className='text-[16px] leading-[130%] opacity-[33%]'>
                ТОВ &quot;ВТС-Х&quot; (стара назва Приватне підприємство
                &quot;ІТМ-ЮА&quot;), зареєстроване в Україні, надає мобільну
                торгову платформу BTC-X.PRO та має наступні юридичні дані.
              </p>
              <p className='mt-4 text-[16px] leading-[130%] opacity-[33%]'>
                Код ЄДРПОУ юридичної особи: 45260571
              </p>
              <p className='mt-4 text-[16px] leading-[130%] opacity-[33%]'>
                IBAN: UA293052990000026001010407651
              </p>
              <p className='mt-4 text-[16px] leading-[130%] opacity-[33%]'>
                Юридична адреса та місцезнаходження: Україна, 50103,
                Дніпропетровська обл., місто Кривий Ріг, вул. Степана Тільги,
                буд. 71
              </p>
            </div>
          </div>
          <div className='flex flex-col gap-8 md:gap-16'>
            <div>
              <ul className='space-y-2'>
                <li>
                  <Link
                    href='#'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-[16px] text-sm leading-[130%] opacity-[33%] hover:text-[#FD6B06] hover:opacity-100 focus:text-[#FD6B06] focus:opacity-100'
                  >
                    Умови та положення
                  </Link>
                </li>
                <li>
                  <Link
                    href='#'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-[16px] text-sm leading-[130%] opacity-[33%] hover:text-[#FD6B06] hover:opacity-100 focus:text-[#FD6B06] focus:opacity-100'
                  >
                    Політика конфіденційності
                  </Link>
                </li>
                <li>
                  <Link
                    href='#'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-[16px] text-sm leading-[130%] opacity-[33%] hover:text-[#FD6B06] hover:opacity-100 focus:text-[#FD6B06] focus:opacity-100'
                  >
                    AML/CTF & KYC
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <Link
                href='mailto:admin@btc-x.pro'
                className='text-[16px] leading-[130%] hover:text-[#FD6B06] focus:text-[#FD6B06]'
              >
                admin@btc-x.pro
              </Link>
            </div>
          </div>
        </div>

        {/* Средний блок */}
        <div className='mb-[60px] flex items-center gap-8'>
          {/* Заголовок */}
          <h1 className='text-[75px] font-bold leading-[110%] tracking-tight'>
            ТОРГУЙТЕ БЕЗ КОМІСІЇ ПРОТЯГОМ УСЬОГО{' '}
            <span className='bg-gradient-to-r from-[#FFC996] via-[#FD6B06] to-[#963706] bg-clip-text text-transparent'>
              2025 РОКУ
            </span>
          </h1>

          {/* Форма */}
          <form className='flex w-[600px] flex-col items-center justify-center gap-4 rounded-full border border-gray-700 sm:flex-row'>
            <input
              type='email'
              placeholder='Введіть ваш e-mail'
              className='w-full rounded-full bg-black px-4 py-2 text-white focus:outline-none focus:ring sm:w-80'
            />
            <button
              type='submit'
              className='rounded-full bg-white px-6 py-2 font-medium text-black hover:bg-[#FD6B06] hover:text-white focus:bg-[#FD6B06] focus:text-white focus:outline-none focus:ring'
            >
              Підписатися на оновлення
            </button>
          </form>
        </div>

        <div className='mb-[40px] border-[0.5px] border-white opacity-[20%]'></div>
        <div className='text-[16px] leading-[130%] opacity-[33%]'>
          BTC-X.PRO дозволяє користувачам отримувати економічну вигоду від руху
          цін фінансових інструментів без необхідності їх матеріального
          володіння. Визначення, такі як &quot;торгівля&quot;,
          &quot;угоди&quot;, &quot;купувати&quot; і &quot;продавати&quot;, що
          використовуються BTC-X.PRO, слід розуміти як ризики, пов&apos;язані з
          позиціями різноманітних фінансових інструментів, які піддіються
          коливанню цін, без права власності на базовий фінансовий інструмент.
          Користувач BTC-X.PRO, у якого є відкрита лонг позиція по акції або ETF
          на момент відкриття ринку у день дати екс-девідендів, отримає
          оголошену суму дивідендів за кожну акцію його позиції. Користувач, у
          якого є відкрита шорт позиція по акції або ETF на момент відкриття
          ринка в день дати екс-дивідендів, заплатить оголошену суму дивідендів
          за кожну акцію його позиції. Як і при будь-якій торгівлі акціями,
          сировинними товарами та криптовалютами, &quot;торгівля&quot; за
          допомогою BTC-X.PRO несе рівень ризику, що може не підходити для всих
          осіб, зацікавлених в торгівлі. Ви можете втратити частину або весь
          свій інвестиційний капітал, тому вам не варто спекулювати капіталом,
          який ви не можете дозволити собі втратити. Вам слід проконсультуватися
          з незалежним фінансовим консультантом перш ніж приймати ризики або
          &quot;торгувати&quot; з BTC-X.PRO. Інформація, розміщена на цьому
          сайті, не застосовується до жителів США або Канади та не може бути
          використана в будь-якій країні чи юрисдикції, де таке використання або
          доступ заборонені відповідно до діючого законодавства.
        </div>
      </div>
    </footer>
  );
}
