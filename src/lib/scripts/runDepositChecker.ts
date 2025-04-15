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

// Держим процесс запущенным
process.on('SIGINT', () => {
  console.log('Received SIGINT. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Shutting down gracefully...');
  process.exit(0);
});
