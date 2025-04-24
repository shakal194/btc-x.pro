import { auth } from '@/auth';
import EquipmentsListUser from '@/components/PageComponents/DashboardPage/Equipments/EquipmentsListUser';
import AdminDashboard from '@/components/PageComponents/DashboardPage/AdminDashboard/AdminDashboard';

export default async function Page() {
  const session = await auth();
  const userStatus = session?.user?.status;
  const userId = session?.user?.id;
  const userEmail = session?.user?.email;

  if (!userId || !userEmail) {
    return <p>User data not available</p>;
  }

  return (
    <main>
      {userStatus === 'admin' ? (
        <AdminDashboard />
      ) : (
        <EquipmentsListUser
          serverUserId={userId.toString()}
          serverUserEmail={userEmail}
        />
      )}
    </main>
  );
}
