import Image from 'next/image';
import Link from 'next/link';

export default function AboutUs() {
  return (
    <div className='bg-black px-4 py-[100px] text-white'>
      <div className='container mx-auto w-[1340px]'>
        {/* О нас */}
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
          <div>
            <h2 className='mb-6 text-[50px] font-bold leading-[110%]'>
              Про нас
            </h2>
            <p className='w-[250px] font-ibm opacity-[33%]'>
              BTC-X — ваш надійний провідник у світі трейдингу
            </p>
          </div>
          <div>
            <p className='mb-[30px] text-[30px] leading-[120%]'>
              Ми відкриті{' '}
              <span className='text-[#FE9900]'>
                для кожного, хто прагне рости,
              </span>{' '}
              розвиватися та залишатися в курсі трендів у світі фінансів і
              крипти.{' '}
            </p>
            <Image
              src='/our_team.png'
              alt='Команда BTC-X'
              width={400}
              height={300}
              className='h-[300px] w-[400px] rounded-lg'
            />
            <p className='mt-[10px] w-[250px] font-ibm opacity-[33%]'>
              Команда BTC-X
            </p>
          </div>
        </div>
        {/* Наша цель */}
        <div className='mb-[60px] mt-[148px]'>
          <h2 className='text-[50px] font-bold leading-[110%]'>
            Наша ціль —{' '}
            <span className='opacity-[33%]'>
              зробити фінансові ринки доступними, зручними та прозорими надаючи,
            </span>{' '}
            чесні умови торгівлі.{' '}
          </h2>
        </div>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
          {' '}
          {/* Image Section */}
          <div className='relative'>
            {/* Фоновое изображение */}
            <Image
              src='/our_mission.png'
              alt='Our Mission'
              width={670}
              height={700}
              className='rounded-lg'
            />
          </div>
          <div className='flex flex-col justify-between rounded-xl px-[45px] shadow-lg'>
            <div>
              <div className='mb-[40px] border-[0.5px] border-white opacity-[33%]'></div>
              <p className='text-primary leading-[120%]'>
                Почніть свою подорож у світ вигідної торгівлі, завантаживши наш
                додаток із App Store або Google Play. Встановіть його та
                підготуйтеся до нових можливостей.
              </p>
            </div>
            <div className='flex items-center gap-8'>
              <Image src='/qr.png' alt='QR Code' width={169} height={169} />
              <div>
                <h2 className='mb-[40px] text-[50px] font-bold leading-[110%]'>
                  Заробляй разом з нами{' '}
                </h2>
                <p className='w-[250px] font-ibm opacity-[33%]'>
                  Скануй щоб завантажити
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className='container mx-auto mb-[40px] mt-16 flex flex-col items-center'>
          <p className='w-[250px] text-center font-ibm opacity-[33%]'>
            Приєднуйся до ком’юніті BTC-X
          </p>
          <h4 className='text-center text-[40px] font-bold leading-[125%] tracking-tight'>
            Долучайся до динамічної спільноти трейдерів та інвесторів, які разом
            створюють нову еру фінансових можливостей
          </h4>
        </div>
        <div className='flex gap-4'>
          <div className='relative rounded-lg bg-gradient-to-r from-[#FFFFFF]/15 to-[#FFFFFF]/30 p-[1px]'>
            <div className='flex rounded-lg bg-[#111111] py-[40px] pr-[30px]'>
              <div className='flex flex-col items-center'>
                <Link
                  href='https://www.youtube.com/@BTC-X'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <div className='group relative flex h-[100px] w-[100px] items-center justify-center rounded-full border border-[#FE9900] bg-[#111111] from-[#FE9900] via-[#FD6B06] to-[#985C00] p-[1px] hover:bg-gradient-to-r'>
                    <svg
                      width='25'
                      height='18'
                      viewBox='0 0 25 18'
                      fill='currentColor'
                      xmlns='http://www.w3.org/2000/svg'
                      className='text-white transition-colors group-hover:text-black'
                    >
                      <path d='M24.0256 1.50225C23.1231 0.435242 21.457 0 18.2751 0H6.72468C3.46992 0 1.77556 0.463317 0.876532 1.59931C0 2.70691 0 4.33886 0 6.59753V10.9025C0 15.2783 1.04 17.5 6.72468 17.5H18.2752C21.0345 17.5 22.5635 17.1159 23.5527 16.1743C24.5672 15.2087 25 13.6321 25 10.9025V6.59753C25 4.21557 24.9322 2.57399 24.0256 1.50225ZM16.0501 9.34439L10.8051 12.0709C10.6878 12.1319 10.5596 12.1621 10.4315 12.1621C10.2865 12.1621 10.1419 12.1233 10.0137 12.0462C9.77242 11.9007 9.62508 11.6406 9.62508 11.36V5.92438C9.62508 5.64427 9.77202 5.38437 10.0128 5.23887C10.2537 5.09336 10.5533 5.08341 10.8032 5.21256L16.0482 7.92155C16.3151 8.05936 16.4827 8.33337 16.4831 8.63233C16.4834 8.93152 16.3165 9.20594 16.0501 9.34439Z' />
                    </svg>
                  </div>
                </Link>
                <h4 className='mb-5 mt-[50px] text-center text-[22px] leading-[120%]'>
                  Ми в Youtube
                </h4>
                <p className='text-center text-[14px] opacity-[33%]'>
                  Ділимося найкращими порадами та стратегіями
                </p>
              </div>
              <Image
                src='/youtube-BTC-X.png'
                alt='Youtube BTC-X'
                width={362}
                height={280}
              />
            </div>
          </div>
          <div className='relative rounded-lg bg-gradient-to-r from-[#FFFFFF]/15 to-[#FFFFFF]/30 p-[1px]'>
            <div className='flex h-full w-[210px] flex-col items-center rounded-md bg-[#111111] py-[40px]'>
              <Link
                href='https://t.me/+7_3pToHuJwJhZTVi'
                target='_blank'
                rel='noopener noreferrer'
              >
                <div className='group relative flex h-[100px] w-[100px] items-center justify-center rounded-full border border-[#FE9900] bg-[#111111] from-[#FE9900] via-[#FD6B06] to-[#985C00] p-[1px] hover:bg-gradient-to-r'>
                  <svg
                    width='25'
                    height='22'
                    viewBox='0 0 25 22'
                    fill='currentColor'
                    xmlns='http://www.w3.org/2000/svg'
                    className='text-white transition-colors group-hover:text-black'
                  >
                    <path d='M0.551269 10.7802L6.30165 12.8261L19.9537 4.083C20.1516 3.95621 20.3544 4.23777 20.1837 4.40234L9.84807 14.3681L9.46371 19.9474C9.43445 20.3719 9.92251 20.6082 10.2122 20.3098L13.3945 17.0317L19.2121 21.6451C19.8391 22.1424 20.7472 21.7919 20.9163 20.9873L24.9671 1.71995C25.1982 0.620807 24.1701 -0.306682 23.1667 0.0958375L0.52201 9.17936C-0.188347 9.46433 -0.168999 10.524 0.551269 10.7802Z' />
                  </svg>
                </div>
              </Link>
              <h4 className='mb-5 mt-[50px] text-[22px] leading-[120%]'>
                Ми в Telegram
              </h4>
              <p className='text-center text-[14px] opacity-[33%]'>
                Спілкуйся з однодумцями та отримуй поради
              </p>
            </div>
          </div>
          <div className='relative rounded-lg bg-gradient-to-r from-[#FFFFFF]/15 to-[#FFFFFF]/30 p-[1px]'>
            <div className='flex h-full w-[210px] flex-col items-center rounded-md bg-[#111111] py-[40px]'>
              <Link
                href='https://t.me/+7_3pToHuJwJhZTVi'
                target='_blank'
                rel='noopener noreferrer'
              >
                <div className='group relative flex h-[100px] w-[100px] items-center justify-center rounded-full border border-[#FE9900] bg-[#111111] from-[#FE9900] via-[#FD6B06] to-[#985C00] p-[1px] hover:bg-gradient-to-r'>
                  <svg
                    width='25'
                    height='23'
                    viewBox='0 0 25 23'
                    xmlns='http://www.w3.org/2000/svg'
                    className='text-white transition-colors group-hover:text-black'
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
              <h4 className='mb-5 mt-[50px] text-[22px] leading-[120%]'>
                Ми у Twitter
              </h4>
              <p className='text-center text-[14px] opacity-[33%]'>
                Будь у курсі всіх трендів та важливих подій
              </p>
            </div>
          </div>
          <div className='relative rounded-lg bg-gradient-to-r from-[#FFFFFF]/15 to-[#FFFFFF]/30 p-[1px]'>
            <div className='flex h-full w-[210px] flex-col items-center rounded-md bg-[#111111] py-[40px]'>
              <Link
                href='https://www.instagram.com/btc_x.pro'
                target='_blank'
                rel='noopener noreferrer'
              >
                <div className='group relative flex h-[100px] w-[100px] items-center justify-center rounded-full border border-[#FE9900] bg-[#111111] from-[#FE9900] via-[#FD6B06] to-[#985C00] p-[1px] hover:bg-gradient-to-r'>
                  <svg
                    width='25'
                    height='25'
                    viewBox='0 0 25 25'
                    fill='currentColor'
                    xmlns='http://www.w3.org/2000/svg'
                    className='text-white transition-colors group-hover:text-black'
                  >
                    <path d='M18.003 0C21.8675 0 25 3.135 25 6.997V18.003C25 21.8675 21.865 25 18.003 25H6.997C3.1325 25 0 21.865 0 18.003V6.997C0 3.1325 3.135 0 6.997 0H18.003ZM12.5 6C8.91 6 6 8.91 6 12.5C6 16.09 8.91 19 12.5 19C16.09 19 19 16.09 19 12.5C19 8.91 16.09 6 12.5 6ZM12.5 8C13.0909 8 13.6761 8.1164 14.2221 8.34254C14.768 8.56869 15.2641 8.90016 15.682 9.31802C16.0998 9.73588 16.4313 10.232 16.6575 10.7779C16.8836 11.3239 17 11.9091 17 12.5C17 13.0909 16.8836 13.6761 16.6575 14.2221C16.4313 14.768 16.0998 15.2641 15.682 15.682C15.2641 16.0998 14.768 16.4313 14.2221 16.6575C13.6761 16.8836 13.0909 17 12.5 17C11.3065 17 10.1619 16.5259 9.31802 15.682C8.47411 14.8381 8 13.6935 8 12.5C8 11.3065 8.47411 10.1619 9.31802 9.31802C10.1619 8.47411 11.3065 8 12.5 8ZM19.75 3.5C19.2859 3.5 18.8408 3.68437 18.5126 4.01256C18.1844 4.34075 18 4.78587 18 5.25C18 5.71413 18.1844 6.15925 18.5126 6.48744C18.8408 6.81563 19.2859 7 19.75 7C20.2141 7 20.6592 6.81563 20.9874 6.48744C21.3156 6.15925 21.5 5.71413 21.5 5.25C21.5 4.78587 21.3156 4.34075 20.9874 4.01256C20.6592 3.68437 20.2141 3.5 19.75 3.5Z' />
                  </svg>
                </div>
              </Link>
              <h4 className='mb-5 mt-[50px] text-[22px] leading-[120%]'>
                Ми в Instagram
              </h4>
              <p className='text-center text-[14px] opacity-[33%]'>
                Слідкуй за нашими оновленнями
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
