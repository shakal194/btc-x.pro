import { fetchUserDataByUuid } from '@/lib/data';
import UserMiningRewardsTable from '@/components/PageComponents/DashboardPage/Users/UserMiningRewardsTable';
import notFound from './not-found';

export default async function UserMiningRewardsPage(props: {
  params: Promise<{ userId: string }>;
}) {
  const params = await props.params;
  const user = await fetchUserDataByUuid(params.userId);

  if (!user) {
    return notFound();
  }

  return <UserMiningRewardsTable userId={user.id} userEmail={user.email} />;
}
