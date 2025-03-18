import { auth } from '@/auth';
import Store from '@/components/PageComponents/DashboardPage/Store/Store';

export default async function Page() {
  const session = await auth();
  const userStatus = session?.user?.status;

  if (userStatus !== 'admin') {
    return (
      <main>
        <div>
          <Store />;
        </div>
        <div className='mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8'></div>
      </main>
    );
  }
}
