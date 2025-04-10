import NavLinksAdmin from '@/components/PageComponents/DashboardPage/NavLinksAdmin';
import NavLinksUser from '@/components/PageComponents/DashboardPage/NavLinksUser';
import { PowerIcon } from '@heroicons/react/24/outline';
import { signOut } from '@/auth';
import { useTranslations } from 'next-intl';

export default function SideNav({
  userStatus,
  locale,
}: {
  userStatus: string | undefined;
  locale: string;
}) {
  const t = useTranslations('cloudMiningPage.dashboard.nav');

  return (
    <div className='flex flex-col lg:px-2'>
      <div className='flex grow flex-row items-center justify-between space-x-2 lg:flex-col lg:items-stretch lg:space-x-0 lg:space-y-2 lg:overflow-y-auto'>
        {userStatus === 'admin' ? (
          <NavLinksAdmin locale={locale} />
        ) : (
          <NavLinksUser locale={locale} />
        )}
        <div className='lg:flex lg:grow lg:flex-col lg:justify-end'>
          <form
            action={async () => {
              'use server';
              await signOut({ redirectTo: `/${locale}/cloud-mining` });
            }}
          >
            <button className='flex h-[48px] w-full items-center justify-center gap-2 rounded-md bg-gray-100 p-3 text-sm font-medium hover:bg-sky-100 hover:text-[#FD6B06] lg:justify-start lg:p-2 lg:px-3'>
              <PowerIcon className='w-6' />
              <div className='hidden lg:block'>{t('logout')}</div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
