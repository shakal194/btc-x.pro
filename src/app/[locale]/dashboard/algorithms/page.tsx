import { auth } from '@/auth';
import PricePerKWh from '@/components/PageComponents/DashboardPage/components/PricePerKWh';

export default async function Page() {
  const session = await auth();

  return (
    <main>
      <PricePerKWh />
      <div>
        <div className='grid gap-2 md:grid-cols-2'></div>
      </div>
      <div className='mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8'></div>
    </main>
  );
}
