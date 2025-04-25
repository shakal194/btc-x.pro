import SignInWrapper from '@/components/PageComponents/SignInPage/SignInWrapper';
import HeaderDashboard from '@/components/HeaderDashboard';
import Image from 'next/image';

export default async function LoginPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;
  const locale = params.locale;

  return (
    <>
      <HeaderDashboard />
      <main className='lg:p-10'>
        <div className='container mx-auto flex grid-flow-col-dense flex-col-reverse items-center gap-8 p-4 md:grid md:grid-cols-2'>
          <div className='mx-auto w-full rounded-xl bg-gradient-to-r from-[#553300] to-[#FE9900] p-[1px] md:w-[350px] lg:w-[400px] xl:w-[500px]'>
            <div className='mx-auto flex flex-col items-center rounded-xl bg-black p-4 lg:p-8'>
              <SignInWrapper locale={locale} />
            </div>
          </div>
          <div>
            <Image
              src='/cloud_mining_sign.webp'
              width={600}
              height={600}
              alt='Cloud Mining with BTC-X.pro'
              className='rounded-2xl'
            />
          </div>
        </div>
      </main>
    </>
  );
}
