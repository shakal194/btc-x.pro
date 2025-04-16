import { fetchUserDataByUuid } from '@/lib/data';
import UserDepositsTable from '@/components/PageComponents/DashboardPage/Users/UserDepositsTable';
import { notFound } from 'next/navigation';

export default async function UserDepositsPage(props: {
  params: Promise<{ userId: string }>;
}) {
  const params = await props.params;
  const user = await fetchUserDataByUuid(params.userId);

  if (!user) {
    notFound();
  }

  return <UserDepositsTable userId={user.id} userEmail={user.email} />;
}
