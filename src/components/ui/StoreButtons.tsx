'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const StoreButtons: React.FC<{ theme?: 'light' | 'dark' }> = ({
  theme = 'light',
}) => {
  const [isMobile, setIsMobile] = useState<boolean | null>(null); // null для SSR

  useEffect(() => {
    // Код выполняется только в браузере
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize(); // Проверить сразу после загрузки
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (isMobile === null) return null; // Пока не определили, ничего не рендерим

  const appStoreImg =
    theme === 'dark' ? '/appstore_white.png' : '/appstore.png';
  const googlePlayImg =
    theme === 'dark' ? '/googleplay_white.png' : '/googleplay.png';

  const buttonWidth = isMobile ? 120 : 185;
  const buttonHeight = isMobile ? 35 : 55;

  return (
    <>
      <Link
        href='https://apps.apple.com/ua/app/btc-x-pro/id6479724977'
        target='_blank'
        rel='noopener noreferrer'
      >
        <Image
          src={appStoreImg}
          alt='App Store'
          width={buttonWidth}
          height={buttonHeight}
        />
      </Link>
      <Link
        href='https://play.google.com/store/apps/details?id=btcx.pro'
        target='_blank'
        rel='noopener noreferrer'
      >
        <Image
          src={googlePlayImg}
          alt='Google Play'
          width={buttonWidth}
          height={buttonHeight}
        />
      </Link>
    </>
  );
};

export default StoreButtons;
