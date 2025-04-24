import Image from 'next/image';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

export default function ForWhoSection() {
  const t = useTranslations('cloudMiningPage.forWho');
  const currentLocale = useLocale();

  return (
    <section className='py-[30px] lg:pt-[100px]'>
      <div className='container mx-auto px-4'>
        <div className='mb-12 flex flex-col-reverse justify-between md:flex-row md:items-center'>
          <h2 className='mb-6 text-font30Leading110 tracking-tight md:w-[450px] lg:w-full lg:text-font50Leading110'>
            {t('title')}
          </h2>
        </div>
        <div className='grid grid-cols-2 gap-2 md:gap-4 lg:gap-8 xl:grid-cols-4'>
          {[
            {
              image: '/our_asic_1.png',
              text: `${t('content')}`,
              price: `${t('content_price')}`,
              profit: `${t('content_profit')}`,
            },
            {
              image: '/our_asic_2.png',
              text: `${t('content_2')}`,
              price: `${t('content_2_price')}`,
              profit: `${t('content_2_profit')}`,
            },
            {
              image: '/our_asic_3.png',
              text: `${t('content_3')}`,
              price: `${t('content_3_price')}`,
              profit: `${t('content_3_profit')}`,
            },
            {
              image: '/our_asic_4.png',
              text: `${t('content_4')}`,
              price: `${t('content_4_price')}`,
              profit: `${t('content_4_profit')}`,
            },
          ].map((program, index) => (
            <div
              key={index}
              className='group relative h-full w-full overflow-hidden rounded-lg bg-gradient-to-r from-[#FFFFFF]/15 to-[#FFFFFF]/30 p-[1px] xl:h-[477px]'
            >
              <div className='relative flex h-full flex-col rounded-lg bg-[#111111]'>
                {/* Картинка */}
                <Image
                  src={program.image}
                  alt={`Our program ${index + 1}`}
                  width={342}
                  height={477}
                  className='rounded-lg object-cover md:w-full lg:h-full'
                />

                {/* Текст */}
                <div className='group-transition absolute bottom-0 left-0 w-full px-4 text-white transition-transform delay-200 duration-300 ease-in-out group-hover:-translate-y-20 lg:bottom-[-50px] lg:text-center'>
                  <h4 className='mb-[20px] text-[13px] leading-[120%] md:text-[22px]'>
                    {program.text}
                  </h4>
                  <h4 className='mb-[20px] text-[13px] leading-[120%] md:text-[22px]'>
                    {program.price}
                  </h4>
                  <h4 className='mb-[20px] text-[13px] leading-[120%] md:text-[22px]'>
                    {program.profit}
                  </h4>

                  {/* Кнопка */}
                  <Link
                    href={`/${currentLocale}/signin`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='hidden rounded-full border px-5 py-3 text-font18 font-bold leading-[110%] transition delay-200 hover:border-[#FD6B06] hover:bg-[#FD6B06] hover:text-white focus:bg-[#FD6B06] focus:text-white lg:inline-block'
                  >
                    {t('text_button')}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
