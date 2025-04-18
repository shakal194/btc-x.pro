import { auth } from '@/auth';
import EquipmentsListUser from '@/components/PageComponents/DashboardPage/Equipments/EquipmentsListUser';

export default async function Page() {
  const session = await auth();
  const userStatus = session?.user?.status;
  const userId = session?.user?.id;
  const userEmail = session?.user?.email;

  if (userStatus !== 'admin') {
    if (!userId || !userEmail) {
      return <p>User data not available</p>;
    }

    return (
      <main>
        <div>
          <EquipmentsListUser
            serverUserId={userId.toString()}
            serverUserEmail={userEmail}
          />
        </div>
        <div className='mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8'></div>
      </main>
    );
  }

  return (
    <main>
      <h1 className='mb-4 text-xl text-foreground md:text-2xl'>
        Welcome to your Dashboard
      </h1>
      <div>
        <div className='grid gap-2 md:grid-cols-2'></div>
      </div>
      <div className='mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8'></div>
    </main>
  );
}
