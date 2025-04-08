import { auth } from '@/auth';
import { ReferralSettings } from './ReferralSettings';

export default async function Page() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  return (
    <main className='container mx-auto p-4'>
      <h1 className='mb-8 text-2xl font-bold text-white'>Настройки</h1>
      <div className='space-y-6 rounded-lg p-6'>
        <div>
          <h2 className='mb-2 text-lg font-semibold text-white'>
            Данные пользователя
          </h2>
          <p className='text-white'>Email: {session.user.email}</p>
        </div>

        <ReferralSettings userId={session.user.id} />
      </div>
    </main>
  );
}
