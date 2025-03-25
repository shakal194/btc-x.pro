import UsersTable from '@/components/PageComponents/DashboardPage/Users/UserTable';

export default function UserListPage() {
  return (
    <main>
      <div>
        <UsersTable />;
      </div>
      <div className='mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8'></div>
    </main>
  );
}
