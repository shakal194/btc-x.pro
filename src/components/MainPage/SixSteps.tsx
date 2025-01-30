import Image from 'next/image';
import StoreButtons from '@/components/ui/StoreButtons';

export default function FiveSteps() {
  return (
    <section className='rounded-b-xl bg-[#F4F4F4] pb-[55px] text-black lg:py-[100px]'>
      <div className='container mx-auto px-4 lg:w-[1340px]'>
        <div className='flex flex-col-reverse gap-8 lg:grid lg:grid-cols-2'>
          <div className='rounded-xl px-[10px] py-[30px] shadow-lg lg:px-[45px] lg:py-[60px]'>
            <p className='mb-[24px] w-[250px] font-ibm text-ibm13Leading130 opacity-[33%] lg:text-ibm16Leading130'>
              Простий гайд, який полегшить твою торгівлю криптовалютою
            </p>
            <h2 className='mb-4 text-font30Leading110 lg:text-font50Leading110'>
              6 кроків для легкого старту з BTC-X
            </h2>
            <div className='my-[20px] border-t border-black opacity-[33%] lg:my-[40px]'></div>
            <div className='lg:space-y-6'>
              <div className='mb-[10px] p-[15px] lg:mb-5 lg:p-[30px]'>
                <span className='font16Leading130 rounded-full border px-[10px] py-[3px] text-[10px] leading-[120%] leading-[130%] lg:px-[20px] lg:py-[4px]'>
                  Крок 1
                </span>
                <h3 className='mb-[15px] mt-[28px] text-font16Leading120 text-font22Leading120'>
                  Завантажте додаток
                </h3>
                <p className='mb-[20px] leading-[130%] text-black/50'>
                  Почніть свою подорож у світ вигідної торгівлі, завантаживши
                  наш додаток із App Store або Google Play. Встановіть його та
                  підготуйтеся до нових можливостей.
                </p>
                <div className='flex justify-between'>
                  <StoreButtons theme='light' />
                </div>
              </div>
              <div className='mb-[10px] p-[15px] lg:mb-5 lg:p-[30px]'>
                <span className='font16Leading130 rounded-full border px-[10px] py-[3px] text-[10px] leading-[120%] leading-[130%] lg:px-[20px] lg:py-[4px]'>
                  Крок 2
                </span>
                <h3 className='mb-[15px] mt-[28px] text-font16Leading120 text-font22Leading120'>
                  Зареєструйтесь та введіть реферальний код
                </h3>
                <p className='leading-[130%] text-black/50'>
                  Пройдіть простий процес реєстрації, обов’язково вказавши
                  реферальний код, щоб отримати привілеї &quot;без
                  комісій&quot;. Цей крок відкриє для вас найкращі умови
                  торгівлі.
                </p>
              </div>
              <div className='mb-[10px] p-[15px] lg:mb-5 lg:p-[30px]'>
                <span className='font16Leading130 rounded-full border px-[10px] py-[3px] text-[10px] leading-[120%] leading-[130%] lg:px-[20px] lg:py-[4px]'>
                  Крок 3
                </span>
                <h3 className='mb-[15px] mt-[28px] text-font16Leading120 text-font22Leading120'>
                  Пройдіть KYC
                </h3>
                <p className='leading-[130%] text-black/50'>
                  Підтвердіть свою особу за кілька простих кроків, щоб отримати
                  повний доступ до всіх функцій платформи.
                </p>
              </div>
              <div className='mb-[10px] p-[15px] lg:mb-5 lg:p-[30px]'>
                <span className='font16Leading130 rounded-full border px-[10px] py-[3px] text-[10px] leading-[120%] leading-[130%] lg:px-[20px] lg:py-[4px]'>
                  Крок 4
                </span>
                <h3 className='mb-[15px] mt-[28px] text-font16Leading120 text-font22Leading120'>
                  Поповніть рахунок та вкажіть торгову силу
                </h3>
                <p className='leading-[130%] text-black/50'>
                  Додайте кошти на рахунок та налаштуйте торгову силу, щоб
                  отримати більше можливостей для роботи на ринку. Це дозволить
                  відкривати більші позиції без ризику ліквідації вашого
                  депозиту.
                </p>
              </div>
              <div className='mb-[10px] p-[15px] lg:mb-5 lg:p-[30px]'>
                <span className='font16Leading130 rounded-full border px-[10px] py-[3px] text-[10px] leading-[120%] leading-[130%] lg:px-[20px] lg:py-[4px]'>
                  Крок 5
                </span>
                <h3 className='mb-[15px] mt-[28px] text-font16Leading120 text-font22Leading120'>
                  Отримайте прибуток
                </h3>
                <p className='leading-[130%] text-black/50'>
                  Відкривайте угоди та використовуйте всі доступні інструменти
                  для максимальної ефективності. Завдяки чесним умовам і
                  відсутності комісій ви зосереджуєтеся лише на прибутках.
                </p>
              </div>
              <div className='mb-[10px] p-[15px] lg:mb-5 lg:p-[30px]'>
                <span className='font16Leading130 rounded-full border px-[10px] py-[3px] text-[10px] leading-[120%] leading-[130%] lg:px-[20px] lg:py-[4px]'>
                  Крок 6
                </span>
                <h3 className='mb-[15px] mt-[28px] text-font16Leading120 text-font22Leading120'>
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
          <div className='relative lg:h-[700px]'>
            {/* Фоновое изображение */}
            <Image
              src='/client.png'
              alt='Client image'
              width={670}
              height={700}
              className='rounded-lg'
            />

            {/* Отзыв */}

            <blockquote className='absolute bottom-[10px] left-1/2 w-[90%] -translate-x-1/2 transform rounded-3xl pb-[15px] pl-[11px] shadow-lg backdrop-blur-lg lg:bottom-[74px] lg:pb-[27px] lg:pl-[40px]'>
              <Image
                src='/quote.svg'
                alt='quote'
                width={30}
                height={22}
                className='my-[10px] rounded-full lg:mb-[20px] lg:mt-[25px]'
              />
              <p className='text-[10px] leading-[120%] text-white lg:text-[22px]'>
                “Торгівля з BTC-X стала набагато приємнішою завдяки 0% комісій і
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
