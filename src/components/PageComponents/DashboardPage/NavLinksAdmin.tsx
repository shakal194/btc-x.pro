'use client';

import {
  HomeIcon,
  //DocumentDuplicateIcon,
  AdjustmentsHorizontalIcon,
  CodeBracketSquareIcon,
  ServerStackIcon,
  UsersIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.

export default function NavLinksAdmin() {
  const pathname = usePathname();
  const t = useTranslations('cloudMiningPage.dashboard.nav');

  const links = [
    { name: `${t('home')}`, href: '/dashboard', icon: HomeIcon },
    {
      name: `${t('algorithms')}`,
      href: '/dashboard/algorithms',
      icon: CodeBracketSquareIcon,
    },
    {
      name: `${t('equipments')}`,
      href: '/dashboard/equipments',
      icon: ServerStackIcon,
    },
    //{
    //  name: `${t('yourMiners')}`,
    //   href: '/dashboard/miners',
    //    icon: DocumentDuplicateIcon,
    //  },
    {
      name: `${t('customers')}`,
      href: '/dashboard/users',
      icon: UsersIcon,
    },
    {
      name: 'CoinsBuy',
      href: '/dashboard/coinsbuy',
      icon: BanknotesIcon,
    },
    {
      name: `${t('settings')}`,
      href: '/dashboard/settings',
      icon: AdjustmentsHorizontalIcon,
    },
  ];

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-100 p-3 text-sm font-medium hover:bg-sky-100 hover:text-[#FD6B06] lg:flex-none lg:justify-start lg:p-2 lg:px-3',
              {
                'bg-sky-100 text-[#FD6B06]': pathname === link.href,
              },
            )}
          >
            <LinkIcon className='w-6' />
            <p className='hidden lg:block'>{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
