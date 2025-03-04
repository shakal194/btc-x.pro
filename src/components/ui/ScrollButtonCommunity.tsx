'use client'; // Директива для Client Component

import { useTranslations } from 'next-intl';

export default function ScrollButtonCommunity() {
  const t = useTranslations('mainPage.sixsteps');

  const handleClick = () => {
    document.getElementById('social')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <button
      className='text-font18 mt-[30px] block w-full rounded-full border px-5 py-3 text-center font-bold leading-[110%] transition delay-200 hover:border-[#FD6B06] hover:bg-[#FD6B06] hover:text-white focus:bg-[#FD6B06] focus:text-white lg:w-[280px]'
      onClick={handleClick}
    >
      {t('step_6_button')}
    </button>
  );
}
