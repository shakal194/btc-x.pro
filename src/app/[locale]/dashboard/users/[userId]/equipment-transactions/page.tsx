import { fetchUserDataByUuid } from '@/lib/data';
import UserEquipmentTransactionsTable from '@/components/PageComponents/DashboardPage/Users/UserEquipmentTransactionsTable';
import notFound from './not-found';

export default async function UserEquipmentTransactionsPage(props: {
  params: Promise<{ userId: string }>;
}) {
  const params = await props.params;
  const user = await fetchUserDataByUuid(params.userId);

  if (!user) {
    return notFound();
  }

  return (
    <UserEquipmentTransactionsTable userId={user.id} userEmail={user.email} />
  );
}
