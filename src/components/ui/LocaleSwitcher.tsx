'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

import { i18n } from '@/i18n.config';

export default function LocaleSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<string>(
    i18n.defaultLocale,
  );
  const pathName = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getNextLocale = () => {
    if (typeof window !== 'undefined') {
      const cookies = document.cookie.split('; ');
      const nextLocale = cookies.find((cookie) =>
        cookie.startsWith('NEXT_LOCALE='),
      );
      return nextLocale ? nextLocale.split('=')[1] : i18n.defaultLocale;
    }
    return i18n.defaultLocale; // Если выполняется на сервере
  };

  // Обновляем состояние локали при монтировании компонента
  useEffect(() => {
    setCurrentLocale(getNextLocale());
  }, []);

  const redirectedPathName = (locale: string) => {
    if (!pathName) return '/';
    const segments = pathName.split('/');
    segments[1] = locale;
    return segments.join('/');
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  const handleEscapeKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathName]);

  return (
    <div className='relative' ref={dropdownRef}>
      <button onClick={toggleDropdown} className='flex items-center p-2'>
        <span>{currentLocale.toUpperCase()}</span>
        <svg
          className={`ml-2 h-4 w-4 transform ${isOpen ? 'rotate-180' : ''}`}
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M19 9l-7 7-7-7'
          />
        </svg>
      </button>

      {isOpen && (
        <ul className='absolute left-0 mt-2 rounded-lg border border-gray-300 bg-white shadow-lg'>
          {i18n.locales.map((locale) => (
            <li key={locale}>
              <Link
                href={redirectedPathName(locale)}
                className='block rounded-lg px-4 py-2 text-black transition delay-200 hover:bg-[#FD6B06] hover:text-white focus:bg-[#FD6B06] focus:text-white'
                onClick={() => setIsOpen(false)}
              >
                {locale.toUpperCase()}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
