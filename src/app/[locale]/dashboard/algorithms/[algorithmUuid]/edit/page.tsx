import AlgorithmEdit from '@/components/PageComponents/DashboardPage/Algorithms/AlgorithmEdit';
import notFound from './not-found';
import { fetchAlgorithmByUuid } from '@/lib/data';

export default async function AlgorithmEditPage(props: {
  params: Promise<{ algorithmUuid: string }>;
}) {
  const params = await props.params;
  const uuid = params.algorithmUuid;

  // Проверка существования алгоритма
  const algorithm = await fetchAlgorithmByUuid(uuid);
  if (!algorithm) {
    return notFound();
  }

  return (
    <main>
      <div>
        <AlgorithmEdit algorithmUuid={uuid} />
      </div>
      <div className='mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8'></div>
    </main>
  );
}
