module.exports = {
  apps: [
    {
      name: 'deposit-checker',
      script: 'npx',
      args: 'tsx src/lib/scripts/runDepositChecker.ts',
      autorestart: true, // Перезапускать при ошибке
      env: {
        NODE_ENV: 'production',
      },
      cwd: '/path/to/your/project', // Укажите полный путь к проекту
      time: true, // Добавляем временные метки в логи
    },
  ],
}; 