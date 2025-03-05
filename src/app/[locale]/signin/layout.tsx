import { generateMetadata } from '@/lib/MetaData';

export { generateMetadata };

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
