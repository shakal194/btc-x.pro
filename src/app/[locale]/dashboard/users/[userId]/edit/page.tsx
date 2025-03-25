import UserEdit from '@/components/PageComponents/DashboardPage/Users/UserEdit';

export default async function UserEditPage(props: {
  params: Promise<{ userId: string }>;
}) {
  const params = await props.params;
  const uuid = params.userId;

  return (
    <main>
      <div>
        <UserEdit uuid={uuid} />
      </div>
      <div className='mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8'></div>
    </main>
  );
}
