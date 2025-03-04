import Link from 'next/link';
import NavLinks from '@/components/CloudMiningPage/nav-links';
import { PowerIcon } from '@heroicons/react/24/outline';
import { signOut } from '@/auth';
import { useTranslations } from 'next-intl';

export default function SideNav() {
  const t = useTranslations('cloudMiningPage.dashboard.nav');

  return (
    <div className='flex h-full flex-col px-3 py-4 md:px-2'>
      <div className='flex grow flex-row items-center justify-between space-x-2 md:flex-col md:items-stretch md:space-x-0 md:space-y-2 md:overflow-y-auto'>
        <NavLinks />
        <div className='md:flex md:grow md:flex-col md:justify-end'>
          <form
            action={async () => {
              'use server';
              await signOut();
            }}
          >
            <button className='flex h-[48px] w-full items-center justify-center gap-2 rounded-md bg-gray-100 p-3 text-sm font-medium hover:bg-sky-100 hover:text-[#FD6B06] md:justify-start md:p-2 md:px-3'>
              <PowerIcon className='w-6' />
              <div className='hidden md:block'>{t('logout')}</div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
