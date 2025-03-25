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
      <div className='container mx-auto flex h-screen flex-col space-y-4 p-4 lg:flex-row lg:space-y-0 lg:overflow-hidden'>
        <div className='w-full flex-none lg:w-64'>
          <SideNav userStatus={userStatus} />
        </div>
        <div className='m-2 flex-grow scrollbar-hide lg:overflow-y-auto'>
          {children}
        </div>
      </div>
    </>
  );
}
