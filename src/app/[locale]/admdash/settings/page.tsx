import { auth } from '@/auth';

export default async function Page() {
  const session = await auth();

  return (
    <main>
      <h1 className='mb-4 text-xl text-foreground md:text-2xl'>
        Here be your settings
      </h1>
      <div>
        <div className='grid gap-2 md:grid-cols-2'></div>
      </div>
      <div className='mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8'></div>
    </main>
  );
}
