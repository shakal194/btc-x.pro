import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function ForWhoSection() {
  const t = useTranslations('referralPage.forWho');

  return (
    <section className='py-[30px] lg:pt-[100px]'>
      <div className='container mx-auto px-4'>
        <div className='mb-12 flex flex-col-reverse justify-between md:flex-row md:items-center'>
          <h2 className='mb-6 text-font30Leading110 tracking-tight md:w-[450px] lg:w-[654px] lg:text-font50Leading110'>
            {t('title')}
          </h2>
          <p className='mb-[10px] w-[155px] font-ibm text-[10px] leading-[130%] opacity-[33%] md:w-[175px] md:w-[250px] md:text-ibm13Leading130 lg:mb-0 lg:text-ibm16Leading130'>
            {t('subtitle')}
          </p>
        </div>
        <div className='grid grid-cols-2 gap-2 md:gap-4 lg:grid-cols-4 lg:gap-8'>
          {[
            {
              image: '/our_program_1.png',
              text: `${t('content')}`,
            },
            {
              image: '/our_program_2.png',
              text: `${t('content_2')}`,
            },
            {
              image: '/our_program_3.png',
              text: `${t('content_3')}`,
            },
            {
              image: '/our_program_4.png',
              text: `${t('content_4')}`,
            },
          ].map((program, index) => (
            <div
              key={index}
              className='mdw-[342px] group relative h-full w-full overflow-hidden rounded-lg bg-gradient-to-r from-[#FFFFFF]/15 to-[#FFFFFF]/30 p-[1px] lg:h-[477px]'
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
                <div className='absolute bottom-0 left-0 w-full px-4 text-white transition-transform duration-300 ease-in-out group-hover:-translate-y-20 lg:bottom-[-50px] lg:text-center'>
                  <h4 className='mb-[20px] text-[13px] leading-[120%] md:text-[22px]'>
                    {program.text}
                  </h4>

                  {/* Кнопка */}

                  <Link
                    href='https://onelink.to/js2s8h'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='hidden rounded-full border px-5 py-3 text-primary font-bold leading-[110%] transition hover:border-[#FD6B06] hover:bg-[#FD6B06] hover:text-white focus:bg-[#FD6B06] focus:text-white lg:inline-block'
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
