import 'dotenv/config';
import cron from 'node-cron';
import { checkAndProcessDeposits } from './checkDeposits';

// Запускаем проверку каждые 2 минуты
cron.schedule('*/2 * * * *', async () => {
  console.log('Running deposit check at:', new Date().toISOString());
  try {
    await checkAndProcessDeposits();
    console.log('Deposit check completed successfully');
  } catch (error) {
    console.error('Error during deposit check:', error);
  }
});

console.log('Deposit checker scheduler started. Will run every 2 minutes.');
