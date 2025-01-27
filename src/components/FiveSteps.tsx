import Image from 'next/image';
import Link from 'next/link';

export default function FiveSteps() {
  return (
    <section className='rounded-b-xl bg-[#F4F4F4] py-[100px] pb-[100px] text-black'>
      <div className='container mx-auto w-[1340px] px-4'>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
          <div className='rounded-xl px-[45px] py-[60px] shadow-lg'>
            <p className='mb-[24px] w-[250px] font-ibm opacity-[33%]'>
              Простий гайд, який полегшить твою торгівлю криптовалютою
            </p>
            <h2 className='mb-4 text-[50px] font-bold leading-[110%]'>
              5 кроків для легкого старту з BTC-X
            </h2>
            <div className='my-[40px] border border-black opacity-[33%]'></div>
            <div className='space-y-6'>
              <div className='mb-5 p-[30px]'>
                <span className='rounded-full border px-[20px] py-[4px]'>
                  Крок 1
                </span>
                <h3 className='mb-[15px] mt-[28px] text-[22px] font-semibold leading-[120%]'>
                  Завантажте додаток
                </h3>
                <p className='leading-[130%] text-black/50'>
                  Почніть свою подорож у світ вигідної торгівлі, завантаживши
                  наш додаток із App Store або Google Play. Встановіть його та
                  підготуйтеся до нових можливостей.
                </p>
                <div className='mt-5 flex justify-evenly'>
                  <Link
                    href='https://apps.apple.com/ua/app/btc-x-pro/id6479724977'
                    target='_blank'
                    rel='noopener noreferrer'
                    className=''
                  >
                    <Image
                      src='/appstore.png'
                      alt='App Store'
                      width={185}
                      height={55}
                      className='h-[55px] w-[185px]'
                    />
                  </Link>
                  <Link
                    href='https://play.google.com/store/apps/details?id=btcx.pro'
                    target='_blank'
                    rel='noopener noreferrer'
                    className=''
                  >
                    <Image
                      src='/googleplay.png'
                      alt='Google Play'
                      width={185}
                      height={55}
                      className='h-[55px] w-[185px]'
                    />
                  </Link>
                </div>
              </div>
              <div className='mb-5 p-[30px]'>
                <span className='rounded-full border px-[20px] py-[4px]'>
                  Крок 2
                </span>
                <h3 className='mb-[15px] mt-[28px] text-[22px] font-semibold leading-[120%]'>
                  Зареєструйтесь та введіть реферальний код
                </h3>
                <p className='leading-[130%] text-black/50'>
                  Пройдіть простий процес реєстрації, обов’язково вказавши
                  реферальний код, щоб отримати привілеї &quot;без
                  комісій&quot;. Цей крок відкриє для вас найкращі умови
                  торгівлі.
                </p>
              </div>{' '}
              <div className='mb-5 p-[30px]'>
                <span className='rounded-full border px-[20px] py-[4px]'>
                  Крок 3
                </span>
                <h3 className='mb-[15px] mt-[28px] text-[22px] font-semibold leading-[120%]'>
                  Пройдіть KYC
                </h3>
                <p className='leading-[130%] text-black/50'>
                  Підтвердіть свою особу за кілька простих кроків, щоб отримати
                  повний доступ до всіх функцій платформи.
                </p>
              </div>{' '}
              <div className='mb-5 p-[30px]'>
                <span className='rounded-full border px-[20px] py-[4px]'>
                  Крок 4
                </span>
                <h3 className='mb-[15px] mt-[28px] text-[22px] font-semibold leading-[120%]'>
                  Поповніть рахунок та вкажіть торгову силу
                </h3>
                <p className='leading-[130%] text-black/50'>
                  Додайте кошти на рахунок та налаштуйте торгову силу, щоб
                  отримати більше можливостей для роботи на ринку. Це дозволить
                  відкривати більші позиції без ризику ліквідації вашого
                  депозиту.
                </p>
              </div>{' '}
              <div className='mb-5 p-[30px]'>
                <span className='rounded-full border px-[20px] py-[4px]'>
                  Крок 5
                </span>
                <h3 className='mb-[15px] mt-[28px] text-[22px] font-semibold leading-[120%]'>
                  Отримайте прибуток
                </h3>
                <p className='leading-[130%] text-black/50'>
                  Відкривайте угоди та використовуйте всі доступні інструменти
                  для максимальної ефективності. Завдяки чесним умовам і
                  відсутності комісій ви зосереджуєтеся лише на прибутках.
                </p>
              </div>{' '}
              <div className='mb-5 p-[30px]'>
                <span className='rounded-full border px-[20px] py-[4px]'>
                  Крок 6
                </span>
                <h3 className='mb-[15px] mt-[28px] text-[22px] font-semibold leading-[120%]'>
                  Приєднуйся до ком’юніті
                </h3>
                <p className='leading-[130%] text-black/50'>
                  Спілкуйтесь, діліться досвідом і розвивайтесь разом із нашою
                  активною трейдинговою спільнотою. Відчуйте силу підтримки
                  однодумців та зростайте разом із BTC-X.
                </p>
              </div>
            </div>
          </div>
          {/* Image Section */}
          <div className='relative h-[700px]'>
            {/* Фоновое изображение */}
            <Image
              src='/client.png'
              alt='Client image'
              width={670}
              height={700}
              className='rounded-lg'
            />

            {/* Отзыв */}

            <blockquote className='absolute bottom-[74px] left-1/2 w-[90%] -translate-x-1/2 transform rounded-lg pb-[27px] pl-[40px] shadow-lg backdrop-blur-md'>
              <Image
                src='/quote.svg'
                alt='quote'
                width={30}
                height={22}
                className='mb-[20px] mt-[25px] rounded-full'
              />
              <p className='text-white'>
                “Торгівля в BTC-X стала набагато приємнішою завдяки 0% комісій і
                прозорим умовам.”
              </p>
              <div className='mt-5'>
                <div className='flex items-center'>
                  <Image
                    src='/avatar.png'
                    alt='Avatar'
                    width={40}
                    height={40}
                    className='rounded-full'
                  />
                  <div className='ml-5'>
                    <div className='flex'>
                      {[...Array(5)].map((_, i) => (
                        <Image
                          key={i}
                          src='/Star.svg'
                          alt='Star'
                          width={15}
                          height={15}
                          className='h-[15px] w-[15px] rounded-full'
                        />
                      ))}
                    </div>
                    <p className='mt-2 text-sm text-white'>Влад Карпенко</p>
                  </div>
                </div>
              </div>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
