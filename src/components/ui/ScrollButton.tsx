'use client'; // Директива для Client Component

import { useTranslations } from 'next-intl';

export default function ScrollButton() {
  const t = useTranslations('mainPage.sixsteps');

  const handleClick = () => {
    document.getElementById('social')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <button
      className='mt-[30px] block w-full rounded-full border px-5 py-3 text-center text-primary font-bold leading-[110%] transition hover:border-[#FD6B06] hover:bg-[#FD6B06] hover:text-white focus:bg-[#FD6B06] focus:text-white lg:w-[270px]'
      onClick={handleClick}
    >
      {t('step_6_button')}
    </button>
  );
}
