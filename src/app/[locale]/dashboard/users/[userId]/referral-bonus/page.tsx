import UserRefBonusTable from '@/components/PageComponents/DashboardPage/Users/UserRefBonusTable';
import { fetchUserDataByUuid } from '@/lib/data';
import notFound from './not-found';

export default async function UserRefBonusPage(props: {
  params: Promise<{ userId: string }>;
}) {
  const params = await props.params;
  const uuid = params.userId;

  // Проверка существования пользователя
  const user = await fetchUserDataByUuid(uuid);
  if (!user) {
    return notFound();
  }

  return (
    <main>
      <div>
        <h1 className='mb-6 text-2xl font-bold text-white'>
          История реферальных начислений - {user.email}
        </h1>
        <UserRefBonusTable userId={user.id} userEmail={user.email} />
      </div>
    </main>
  );
}
