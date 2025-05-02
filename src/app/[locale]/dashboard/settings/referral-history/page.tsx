import { auth } from '@/auth';
import ReferralHistoryTable from '@/components/PageComponents/DashboardPage/Settings/ReferralHistoryTable';

export default async function ReferralHistoryPage() {
  const session = await auth();

  if (!session?.user?.id || !session?.user?.email) {
    return null;
  }

  return (
    <main>
      <ReferralHistoryTable userId={Number(session.user.id)} />
    </main>
  );
}
