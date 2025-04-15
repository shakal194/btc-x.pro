import { checkAndProcessDeposits } from './checkDeposits.ts';
import logger from '../logger.js';

// Запускаем сразу при старте
logger.info('Starting transaction monitor...');
checkAndProcessDeposits();

// Затем каждые 2 минуты
setInterval(checkAndProcessDeposits, 2 * 60 * 1000);

// Обработка завершения процесса
process.on('SIGINT', () => {
  logger.info('Stopping transaction monitor...');
  process.exit(0);
}); 