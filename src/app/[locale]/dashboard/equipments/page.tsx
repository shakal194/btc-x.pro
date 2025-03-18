import Equipments from '@/components/PageComponents/DashboardPage/Equipments/EquipmentsList';

export default async function Page() {
  return (
    <main>
      <Equipments />
      <div>
        <div className='grid gap-2 md:grid-cols-2'></div>
      </div>
      <div className='mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8'></div>
    </main>
  );
}
