import SideNav from '@/components/PageComponents/DashboardPage/sidenav';
import FooterSection from '@/components/Footer';
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
      <div className='container mx-auto flex h-screen flex-col p-4 md:flex-row md:overflow-hidden'>
        <div className='w-full flex-none md:w-64'>
          <SideNav userStatus={userStatus} />
        </div>
        <div className='flex-grow p-6 scrollbar-hide md:overflow-y-auto md:p-12'>
          {children}
        </div>
      </div>
      <FooterSection />
    </>
  );
}
