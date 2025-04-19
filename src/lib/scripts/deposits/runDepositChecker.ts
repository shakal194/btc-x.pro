import 'dotenv/config';
import cron from 'node-cron';
import { checkAndProcessDeposits } from '@/lib/scripts/deposits/checkDeposits';

// Запускаем проверку каждые 2 минуты
cron.schedule('*/2 * * * *', async () => {
  try {
    await checkAndProcessDeposits();
    console.log(
      `[${new Date().toLocaleString('ru-RU')}] ✅ Deposit check completed successfully`,
    );
  } catch (error) {
    console.error(
      `[${new Date().toLocaleString('ru-RU')}] ❌ Error during deposit check:`,
      error,
    );
  }
});

// Запускаем проверку сразу при старте
checkAndProcessDeposits().catch((error) => {
  console.error(
    `[${new Date().toLocaleString('ru-RU')}] ❌ Error in initial deposit check:`,
    error,
  );
});

console.log('Deposit checker scheduler started. Will run every 2 minutes.');
