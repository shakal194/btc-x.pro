import { fetchUserDataByUuid } from '@/lib/data';
import UserConvertationsTable from '@/components/PageComponents/DashboardPage/Users/UserConvertationsTable';

export default async function UserConvertationsPage(props: {
  params: Promise<{ userId: string }>;
}) {
  const params = await props.params;
  const user = await fetchUserDataByUuid(params.userId);

  if (!user) {
    return <div>Пользователь не найден</div>;
  }

  return <UserConvertationsTable userId={user.id} userEmail={user.email} />;
}
