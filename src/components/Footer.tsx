import Image from 'next/image';
//import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function Footer({ locale }: { locale: string }) {
  //const t = useTranslations('header');

  return (
    <footer className='bg-black py-[40px] text-white lg:py-[70px]'>
      <div className='container mx-auto items-baseline px-5 md:grid md:grid-rows-2 lg:mb-[40px] lg:flex lg:grid-rows-none lg:justify-between lg:py-3'>
        <div className='mr-[30px] flex items-center md:hidden'>
          <Image
            src='/logo_footer.png' // Замените на путь к вашему логотипу
            alt='BTC-X.PRO, LLC'
            width={50}
            height={50}
          />
          <p className='ml-[10px] w-[140px] text-[13px] font-medium leading-[130%] text-white/30'>
            BTC-X платформа для торгівлі без комісії
          </p>
        </div>
        <div className='my-[25px] border-t border-white opacity-[20%] md:hidden'></div>
        {/* Левый блок с ссылками */}
        <div className='flex flex-col space-y-3 md:flex-row md:items-center md:space-x-6 md:space-y-0 lg:justify-between'>
          <Link
            href={`/${locale}/about-us`}
            className='text-primary leading-[110%] transition hover:text-[#FD6B06] focus:text-[#FD6B06]'
            rel='noopener noreferrer'
          >
            Про нас
          </Link>
          <Link
            href={`/${locale}/referral`}
            className='text-primary leading-[110%] transition hover:text-[#FD6B06] focus:text-[#FD6B06]'
            rel='noopener noreferrer'
          >
            Реферальна програма
          </Link>
          <Link
            href={`/${locale}/airdrop`}
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
        <div className='my-[25px] border-t border-white opacity-[20%] lg:hidden'></div>
        {/* Правый блок с кнопками */}
        <div className='flex items-center justify-between space-x-2 lg:space-x-4'>
          <p className='w-[106px] font-ibm text-ibm13Leading130 opacity-[33%] lg:hidden'>
            Приєднуйся до ком’юніті BTC-X
          </p>
          <div className='grid grid-cols-4 gap-2 md:gap-4'>
            <Link
              href='https://www.instagram.com/btc_x.pro'
              target='_blank'
              rel='noopener noreferrer'
            >
              <div className='group relative flex h-[40px] w-[40px] items-center justify-center rounded-full border border-[#FE9900] bg-[#111111] from-[#FE9900] via-[#FD6B06] to-[#985C00] p-[1px] hover:bg-gradient-to-r focus:bg-gradient-to-r lg:h-[65px] lg:w-[65px]'>
                <svg
                  width='23'
                  height='23'
                  viewBox='0 0 23 23'
                  xmlns='http://www.w3.org/2000/svg'
                  className='hidden text-white transition group-hover:text-black group-focus:text-black lg:block'
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
                <svg
                  width='14'
                  height='14'
                  viewBox='0 0 14 14'
                  xmlns='http://www.w3.org/2000/svg'
                  className='text-white transition-colors group-hover:text-black group-focus:text-black lg:hidden'
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
              <div className='group relative flex h-[40px] w-[40px] items-center justify-center rounded-full border border-[#FE9900] bg-[#111111] from-[#FE9900] via-[#FD6B06] to-[#985C00] p-[1px] hover:bg-gradient-to-r focus:bg-gradient-to-r lg:h-[65px] lg:w-[65px]'>
                <svg
                  width='23'
                  height='19'
                  viewBox='0 0 23 19'
                  xmlns='http://www.w3.org/2000/svg'
                  className='hidden text-white transition-colors group-hover:text-black group-focus:text-black lg:block'
                  fill='currentColor'
                >
                  <path d='M1.06126 9.75476L6.04493 11.4473L17.8767 4.21393C18.0482 4.10903 18.224 4.34197 18.076 4.47813L9.11849 12.7231L8.78538 17.3391C8.76002 17.6902 9.183 17.8857 9.43403 17.6389L12.1921 14.9268L17.234 18.7436C17.7774 19.1551 18.5644 18.8651 18.711 18.1994L22.2217 2.25891C22.4219 1.34955 21.5309 0.58221 20.6613 0.915227L1.0359 8.4303C0.420262 8.66607 0.43703 9.54279 1.06126 9.75476Z' />
                </svg>
                <svg
                  width='14'
                  height='12'
                  viewBox='0 0 14 12'
                  xmlns='http://www.w3.org/2000/svg'
                  className='text-white transition-colors group-hover:text-black group-focus:text-black lg:hidden'
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
              <div className='group relative flex h-[40px] w-[40px] items-center justify-center rounded-full border border-[#FE9900] bg-[#111111] from-[#FE9900] via-[#FD6B06] to-[#985C00] p-[1px] hover:bg-gradient-to-r focus:bg-gradient-to-r lg:h-[65px] lg:w-[65px]'>
                <svg
                  width='23'
                  height='17'
                  viewBox='0 0 23 17'
                  xmlns='http://www.w3.org/2000/svg'
                  className='hidden text-white transition-colors group-hover:text-black group-focus:text-black lg:block'
                  fill='currentColor'
                >
                  <path d='M21.4887 2.22301C20.7066 1.2933 19.2626 0.914062 16.5049 0.914062H6.49456C3.67377 0.914062 2.20533 1.31776 1.42617 2.30758C0.666504 3.27265 0.666504 4.69462 0.666504 6.66265V10.4137C0.666504 14.2264 1.56784 16.1622 6.49456 16.1622H16.505C18.8964 16.1622 20.2216 15.8276 21.0789 15.0071C21.9581 14.1657 22.3332 12.792 22.3332 10.4137V6.66265C22.3332 4.58719 22.2744 3.15684 21.4887 2.22301ZM14.5766 9.05605L10.0309 11.4318C9.92928 11.4849 9.81815 11.5112 9.70716 11.5112C9.5815 11.5112 9.45611 11.4774 9.34505 11.4102C9.13593 11.2834 9.00824 11.0568 9.00824 10.8123V6.07611C9.00824 5.83205 9.13558 5.60559 9.34428 5.47881C9.55305 5.35202 9.8127 5.34336 10.0293 5.45589L14.575 7.81629C14.8062 7.93637 14.9515 8.17512 14.9518 8.43561C14.9521 8.69631 14.8075 8.93541 14.5766 9.05605Z' />
                </svg>
                <svg
                  width='14'
                  height='10'
                  viewBox='0 0 14 10'
                  xmlns='http://www.w3.org/2000/svg'
                  className='text-white transition-colors group-hover:text-black group-focus:text-black lg:hidden'
                  fill='currentColor'
                >
                  <path d='M13.1496 1.13754C12.6683 0.565407 11.7797 0.332031 10.0826 0.332031H3.92243C2.18656 0.332031 1.28291 0.580462 0.803421 1.18958C0.335938 1.78347 0.335938 2.65853 0.335938 3.86962V6.17797C0.335938 8.52425 0.890604 9.71552 3.92243 9.71552H10.0827C11.5543 9.71552 12.3698 9.50958 12.8974 9.00468C13.4384 8.48691 13.6693 7.64154 13.6693 6.17797V3.86962C13.6693 2.59242 13.6331 1.7122 13.1496 1.13754ZM8.89598 5.34248L6.09865 6.80446C6.03611 6.83715 5.96772 6.85336 5.89942 6.85336C5.82209 6.85336 5.74493 6.83255 5.67658 6.79117C5.54789 6.71319 5.46931 6.57371 5.46931 6.42326V3.50868C5.46931 3.35848 5.54768 3.21913 5.67611 3.14111C5.80458 3.06308 5.96437 3.05775 6.09766 3.127L8.89499 4.57956C9.03731 4.65345 9.12669 4.80038 9.12691 4.96068C9.12708 5.12111 9.03809 5.26825 8.89598 5.34248Z' />
                </svg>
              </div>
            </Link>
            <Link
              href='https://www.instagram.com/btc_x.pro'
              target='_blank'
              rel='noopener noreferrer'
            >
              <div className='group relative flex h-[40px] w-[40px] items-center justify-center rounded-full border border-[#FE9900] bg-[#111111] from-[#FE9900] via-[#FD6B06] to-[#985C00] p-[1px] hover:bg-gradient-to-r focus:bg-gradient-to-r lg:h-[65px] lg:w-[65px]'>
                <svg
                  width='23'
                  height='23'
                  viewBox='0 0 23 23'
                  xmlns='http://www.w3.org/2000/svg'
                  className='hidden text-white transition-colors group-hover:text-black group-focus:text-black lg:block'
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
                  width='14'
                  height='14'
                  viewBox='0 0 14 14'
                  xmlns='http://www.w3.org/2000/svg'
                  className='text-white transition-colors group-hover:text-black group-focus:text-black lg:hidden'
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
      </div>
      <div className='container mx-auto flex flex-col-reverse px-4 lg:block'>
        {/* Верхний блок */}
        <div className='mb-8 flex flex-col items-start justify-between border-b border-gray-800 pb-8 lg:flex-row lg:items-center'>
          {/* Логотип и информация о компании */}
          <div className='mb-6 flex items-start md:mb-0'>
            <div className='mr-[30px] hidden flex-col items-center lg:flex'>
              <Image
                src='/logo_footer.png' // Замените на путь к вашему логотипу
                alt='BTC-X.PRO, LLC'
                width={140}
                height={140}
              />
              <p className='mt-[30px] text-font16Leading130'>
                ТОВ &quot;ВТС-Х&quot;
              </p>
            </div>
            <div className='lg:w-[521px]'>
              <p className='text-[13px] leading-[130%] opacity-[33%] lg:text-font16Leading130'>
                ТОВ &quot;ВТС-Х&quot; (стара назва Приватне підприємство
                &quot;ІТМ-ЮА&quot;), зареєстроване в Україні, надає мобільну
                торгову платформу BTC-X.PRO та має наступні юридичні дані.
              </p>
              <p className='mt-4 text-font16Leading130 opacity-[33%]'>
                Код ЄДРПОУ юридичної особи: 45260571
              </p>
              <p className='mt-4 text-font16Leading130 opacity-[33%]'>
                IBAN: UA293052990000026001010407651
              </p>
              <p className='mt-4 text-font16Leading130 opacity-[33%]'>
                Юридична адреса та місцезнаходження: Україна, 50103,
                Дніпропетровська обл., місто Кривий Ріг, вул. Степана Тільги,
                буд. 71
              </p>
            </div>
          </div>
          <div className='my-[25px] w-full border-t border-white opacity-[20%] lg:hidden'></div>
          <div className='flex flex-col gap-8 md:gap-16'>
            <div>
              <ul className='space-y-2'>
                <li>
                  <Link
                    href='#'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-font16Leading130 opacity-[33%] hover:text-[#FD6B06] hover:opacity-100 focus:text-[#FD6B06] focus:opacity-100'
                  >
                    Умови та положення
                  </Link>
                </li>
                <li>
                  <Link
                    href='#'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-font16Leading130 opacity-[33%] hover:text-[#FD6B06] hover:opacity-100 focus:text-[#FD6B06] focus:opacity-100'
                  >
                    Політика конфіденційності
                  </Link>
                </li>
                <li>
                  <Link
                    href='#'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-font16Leading130 opacity-[33%] hover:text-[#FD6B06] hover:opacity-100 focus:text-[#FD6B06] focus:opacity-100'
                  >
                    AML/CTF & KYC
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <Link
                href='mailto:admin@btc-x.pro'
                className='text-font16Leading130 hover:text-[#FD6B06] focus:text-[#FD6B06]'
              >
                admin@btc-x.pro
              </Link>
            </div>
          </div>
        </div>

        {/* Средний блок */}
        <div className='mb-[60px] items-center gap-8 lg:flex'>
          {/* Заголовок */}
          <h1 className='mb-[20px] text-font30Leading110 lg:mb-0 lg:text-font75Leading110'>
            ТОРГУЙТЕ БЕЗ КОМІСІЇ ПРОТЯГОМ УСЬОГО{' '}
            <span className='bg-gradient-to-r from-[#FFC996] via-[#FD6B06] to-[#963706] bg-clip-text text-transparent'>
              2025 РОКУ
            </span>
          </h1>

          {/* Форма */}
          <form className='flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between md:rounded-full md:border md:border-gray-700 lg:w-[600px]'>
            <input
              type='email'
              placeholder='Введіть ваш e-mail'
              className='w-full rounded-full border border-gray-700 bg-black px-4 py-2 text-white focus:outline-none focus:ring sm:w-80 md:border-none'
            />
            <button
              type='submit'
              className='w-full rounded-full bg-white px-6 py-2 text-primary font-bold text-black hover:bg-[#FD6B06] hover:text-white focus:bg-[#FD6B06] focus:text-white focus:outline-none focus:ring md:w-auto'
            >
              Підписатися на оновлення
            </button>
          </form>
        </div>

        <div className='my-[25px] border-t border-white opacity-[20%] lg:mb-[40px]'></div>
      </div>
      <div className='container mx-auto px-4 text-[9px] leading-[130%] opacity-[33%] lg:text-font16Leading130'>
        BTC-X.PRO дозволяє користувачам отримувати економічну вигоду від руху
        цін фінансових інструментів без необхідності їх матеріального володіння.
        Визначення, такі як &quot;торгівля&quot;, &quot;угоди&quot;,
        &quot;купувати&quot; і &quot;продавати&quot;, що використовуються
        BTC-X.PRO, слід розуміти як ризики, пов&apos;язані з позиціями
        різноманітних фінансових інструментів, які піддіються коливанню цін, без
        права власності на базовий фінансовий інструмент. Користувач BTC-X.PRO,
        у якого є відкрита лонг позиція по акції або ETF на момент відкриття
        ринку у день дати екс-девідендів, отримає оголошену суму дивідендів за
        кожну акцію його позиції. Користувач, у якого є відкрита шорт позиція по
        акції або ETF на момент відкриття ринка в день дати екс-дивідендів,
        заплатить оголошену суму дивідендів за кожну акцію його позиції. Як і
        при будь-якій торгівлі акціями, сировинними товарами та криптовалютами,
        &quot;торгівля&quot; за допомогою BTC-X.PRO несе рівень ризику, що може
        не підходити для всих осіб, зацікавлених в торгівлі. Ви можете втратити
        частину або весь свій інвестиційний капітал, тому вам не варто
        спекулювати капіталом, який ви не можете дозволити собі втратити. Вам
        слід проконсультуватися з незалежним фінансовим консультантом перш ніж
        приймати ризики або &quot;торгувати&quot; з BTC-X.PRO. Інформація,
        розміщена на цьому сайті, не застосовується до жителів США або Канади та
        не може бути використана в будь-якій країні чи юрисдикції, де таке
        використання або доступ заборонені відповідно до діючого законодавства.
      </div>
    </footer>
  );
}
