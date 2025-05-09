import { fetchAllWithdrawals } from '@/lib/data';
import WithdrawalsTabs from '@/components/PageComponents/DashboardPage/Withdrawals/WithdrawalsTabs';

export default async function WithdrawalsPage() {
  const withdrawals = await fetchAllWithdrawals();
  const formattedWithdrawals = withdrawals.map((w) => ({
    ...w,
    feeInUSDT: w.feeInUSDT || '',
    feeInCoin: w.feeInCoin || '',
  }));

  return (
    <div className='flex flex-col gap-4'>
      <div>
        <h1 className='text-2xl font-bold text-default-500'>Выводы</h1>
      </div>
      <WithdrawalsTabs withdrawals={formattedWithdrawals} />
    </div>
  );
}
