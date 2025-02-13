//import Image from 'next/image'; // Импорт компонента Image (если используете Next.js)
import { useTranslations } from 'next-intl';

export default function OnlineStatus() {
  const t = useTranslations('airdrop.launchingToken');
  return (
    <div className='flex animate-pulse items-center'>
      {/*<Image
        src='/live_icon.svg'
        alt='Live Icon'
        width={6}
        height={6}
        className='h-[6px] w-[6px]'
      />*/}
      <div className='h-[6px] w-[6px] rounded-full bg-[#69DF40]'></div>
      <p className='ml-[3px] font-ibm text-ibm13Leading130 leading-[130%] tracking-tight text-[#69DF40] xl:text-ibm16Leading130'>
        {t('live_status')}
      </p>
    </div>
  );
}
