import SideNav from '@/components/PageComponents/DashboardPage/sidenav';
import { auth } from '@/auth';

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const userStatus = session?.user?.status;

  return (
    <>
      <div className='container mx-auto flex h-screen flex-col p-4 lg:flex-row lg:overflow-hidden'>
        <div className='w-full flex-none lg:w-64'>
          <SideNav userStatus={userStatus} />
        </div>
        <div className='flex-grow p-6 scrollbar-hide lg:overflow-y-auto lg:p-12'>
          {children}
        </div>
      </div>
    </>
  );
}
