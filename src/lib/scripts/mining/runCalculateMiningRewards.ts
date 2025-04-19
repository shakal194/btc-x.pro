import 'dotenv/config';
import cron from 'node-cron';
import { runMiningRewardsCalculation } from '@/lib/scripts/mining/calculateMiningRewards';

// Запускаем расчет каждый час
cron.schedule('0 * * * *', async () => {
  try {
    await runMiningRewardsCalculation();
  } catch (error) {
    console.error(
      `[${new Date().toLocaleString('ru-RU')}] ❌ Error in scheduled mining rewards calculation:`,
      error,
    );
  }
});

console.log(
  'Mining rewards calculator scheduler started. Will run every hour.',
);
