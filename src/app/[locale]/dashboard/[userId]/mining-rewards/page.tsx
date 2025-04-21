import { fetchUserDataByUuid } from '@/lib/data';
import { MiningRewardsTable } from '@/components/PageComponents/DashboardPage/MiningRewards/MiningRewardsTable';
import { notFound } from 'next/navigation';

export default async function UserMiningRewardsPage(props: {
  params: Promise<{ userId: string }>;
}) {
  const params = await props.params;
  const user = await fetchUserDataByUuid(params.userId);

  if (!user) {
    notFound();
  }

  return <MiningRewardsTable userId={user.id.toString()} />;
}
