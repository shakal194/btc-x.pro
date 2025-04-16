import SideNav from '@/components/PageComponents/DashboardPage/sidenav';
import { auth } from '@/auth';

export default async function Layout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const session = await auth();
  const userStatus = session?.user?.status;
  const resolvedParams = await params;
  const locale = resolvedParams.locale;

  return (
    <div className='container mx-auto flex h-screen flex-col space-y-4 bg-background p-4 lg:flex-row lg:space-y-0 lg:overflow-hidden'>
      <div className='w-full flex-none lg:w-64'>
        <SideNav userStatus={userStatus} locale={locale} />
      </div>
      <div className='m-2 flex-grow scrollbar-hide lg:overflow-y-auto'>
        {children}
      </div>
    </div>
  );
}
