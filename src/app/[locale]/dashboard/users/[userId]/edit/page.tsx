import UserEdit from '@/components/PageComponents/DashboardPage/Users/UserEdit';
import notFound from './not-found';
import { fetchUserDataByUuid } from '@/lib/data'; // Предположим, что у вас есть такая функция

export default async function UserEditPage(props: {
  params: Promise<{ userId: string }>;
}) {
  const params = await props.params;
  const uuid = params.userId;

  // Проверка существования пользователя
  const user = await fetchUserDataByUuid(uuid);
  if (!user) {
    return notFound(); // Отображение страницы notFound
  }

  return (
    <main>
      <div>
        <UserEdit uuid={uuid} />
      </div>
      <div className='mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8'></div>
    </main>
  );
}
