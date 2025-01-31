import Image from 'next/image';

export default function RatingSection() {
  return (
    <section className='relative z-20 rounded-b-xl bg-[#F4F4F4] py-[100px] text-black'>
      <div className='container mx-auto px-4'>
        <div className='flex flex-col-reverse justify-between md:flex-row md:items-end xl:mb-12'>
          <h2 className='text-font30Leading110 tracking-tight lg:text-font50Leading110 xl:w-[514px]'>
            Рейтинг та винагороди
          </h2>
          <p className='mb-[10px] w-[179px] font-ibm text-ibm13Leading130 opacity-[33%] md:mb-0 lg:text-ibm16Leading130 xl:w-[250px]'>
            Досягайте вищих рангів, щоб отримати ще більше
          </p>
        </div>
        <div className='my-[20px] border-t border-black opacity-[33%] xl:my-[40px]'></div>
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-2 xl:gap-16'>
          <div className='flex flex-col justify-between'>
            <h3 className='text-font16Leading120 text-font22Leading120'>
              Чим більше ви торгуєте,{' '}
              <span className='text-[#FE9900]'>тим вище ваш ранг,</span> а отже,
              тим більше балів ви отримаєте. Кожен ранг{' '}
              <span className='text-[#FE9900]'>дає вам доступ</span> до більшої
              кількості токенів BTCXT
            </h3>
            <p className='text-ibm hidden text-font16Leading130 text-black/50 lg:block'>
              Не забувайте: ви отримуєте більше балів за активну торгівлю та за
              торгівлю ваших рефералів. Ваш ранг та кількість отриманих
              забувайте: ви отримуєте більше балів Не за активну торгівлю
              токенів безпосередньо залежать від вашого торгового обсягу.
            </p>
          </div>
          <div className='xl:w-[608px]'>
            <div className='mb-[20px] flex justify-between'>
              <div className='flex items-center justify-center rounded-full border px-[20px] py-[10px]'>
                <p className='text-font16Leading110'>Ранг</p>
              </div>
              <div className='flex items-center justify-center rounded-full border px-[20px] py-[10px]'>
                <p className='text-font16Leading110'>Обсяг за весь час</p>
              </div>
            </div>
            <div className='mb-[10px] flex items-center justify-between rounded-full bg-white px-[11px] py-[11px] text-black/30'>
              <div className='flex items-center'>
                <Image
                  src='/bronze.png'
                  alt='Bronze rate'
                  width={30}
                  height={30}
                  className='mr-[4px] h-[30px] w-[30px] object-cover'
                />
                <p>Bronze</p>
              </div>
              <div>
                <p>до 100 000 USD</p>
              </div>
            </div>
            <div className='flex items-center justify-between rounded-full bg-white px-[11px] py-[11px]'>
              <div className='flex items-center'>
                <Image
                  src='/silver.png'
                  alt='Silver rate'
                  width={30}
                  height={30}
                  className='mr-[4px] h-[30px] w-[30px] object-cover'
                />
                <p>Silver</p>
              </div>
              <div>
                <p>500 000 USD</p>
              </div>
            </div>
            <div className='mb-[10px] flex items-center justify-between rounded-full bg-white px-[11px] py-[11px] text-black/30'>
              <div className='flex items-center'>
                <Image
                  src='/gold.png'
                  alt='Gold rate'
                  width={30}
                  height={30}
                  className='mr-[4px] h-[30px] w-[30px] object-cover'
                />
                <p>Gold</p>
              </div>
              <div>
                <p>1 000 000 USD</p>
              </div>
            </div>
            <div className='mb-[10px] flex items-center justify-between rounded-full bg-white px-[11px] py-[11px] text-black/30'>
              <div className='flex items-center'>
                <Image
                  src='/platinum.png'
                  alt='Platinum rate'
                  width={30}
                  height={30}
                  className='mr-[4px] h-[30px] w-[30px] object-cover'
                />
                <p>Platinum</p>
              </div>
              <div>
                <p>2 500 000 USD</p>
              </div>
            </div>
            <div className='mb-[10px] flex items-center justify-between rounded-full bg-white px-[11px] py-[11px] text-black/30'>
              <div className='flex items-center'>
                <Image
                  src='/diamond.png'
                  alt='Diamond rate'
                  width={30}
                  height={30}
                  className='mr-[4px] h-[30px] w-[30px] object-cover'
                />
                <p>Diamond</p>
              </div>
              <div>
                <p>5 000 000 USD</p>
              </div>
            </div>
            <div className='mb-[10px] flex items-center justify-between rounded-full bg-white px-[11px] py-[11px] text-black/30'>
              <div className='flex items-center'>
                <Image
                  src='/epic.png'
                  alt='Epic rate'
                  width={30}
                  height={30}
                  className='mr-[4px] h-[30px] w-[30px] object-cover'
                />
                <p>Epic</p>
              </div>
              <div>
                <p>10 000 000 USD</p>
              </div>
            </div>
            <div className='mb-[10px] flex items-center justify-between rounded-full bg-white px-[11px] py-[11px] text-black/30'>
              <div className='flex items-center'>
                <div className='flex'>
                  <Image
                    src='/epic.png'
                    alt='Legendary rate'
                    width={30}
                    height={30}
                    className='mr-[4px] h-[30px] w-[30px] object-cover'
                  />
                  <Image
                    src='/epic.png'
                    alt='Legendary rate'
                    width={30}
                    height={30}
                    className='mr-[4px] h-[30px] w-[30px] object-cover'
                  />
                </div>
                <p>Legendary</p>
              </div>
              <div>
                <p>25 000 000 USD</p>
              </div>
            </div>
            <div className='mb-[10px] flex items-center justify-between rounded-full bg-white px-[11px] py-[11px] text-black/30'>
              <div className='flex items-center'>
                <div className='flex'>
                  <Image
                    src='/epic.png'
                    alt='Master rate'
                    width={30}
                    height={30}
                    className='mr-[4px] h-[30px] w-[30px] object-cover'
                  />
                  <Image
                    src='/epic.png'
                    alt='Master rate'
                    width={30}
                    height={30}
                    className='mr-[4px] h-[30px] w-[30px] object-cover'
                  />
                  <Image
                    src='/epic.png'
                    alt='Master rate'
                    width={30}
                    height={30}
                    className='mr-[4px] h-[30px] w-[30px] object-cover'
                  />
                </div>
                <p>Master</p>
              </div>
              <div>
                <p>50 000 000 USD</p>
              </div>
            </div>
            <div className='mb-[10px] flex items-center justify-between rounded-full bg-white px-[11px] py-[11px] text-black/30'>
              <div className='flex items-center'>
                <Image
                  src='/grandmaster.png'
                  alt='Grandmaster rate'
                  width={30}
                  height={30}
                  className='mr-[4px] h-[30px] w-[30px] object-cover'
                />
                <p>Grandmaster</p>
              </div>
              <div>
                <p>100 000 000 USD</p>
              </div>
            </div>
          </div>
          <p className='text-ibm block text-[10px] text-font16Leading130 leading-[130%] text-black/50 lg:hidden'>
            Не забувайте: ви отримуєте більше балів за активну торгівлю та за
            торгівлю ваших рефералів. Ваш ранг та кількість отриманих забувайте:
            ви отримуєте більше балів Не за активну торгівлю токенів
            безпосередньо залежать від вашого торгового обсягу.
          </p>
        </div>
      </div>
    </section>
  );
}
