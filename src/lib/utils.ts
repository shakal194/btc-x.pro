// Функция для хеширования пароля с использованием Web Crypto API
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  const hashedBuffer = await crypto.subtle.digest('SHA-256', passwordBuffer);

  // Преобразуем ArrayBuffer в строку для хранения в базе данных
  const hashedArray = new Uint8Array(hashedBuffer);
  return Array.from(hashedArray)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

// Функция для проверки пароля с использованием Web Crypto API
export async function verifyPassword(
  storedHash: string,
  enteredPassword: string,
): Promise<boolean> {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(enteredPassword);

  const enteredHashBuffer = await crypto.subtle.digest(
    'SHA-256',
    passwordBuffer,
  );

  // Преобразуем ArrayBuffer в строку для сравнения
  const enteredHashArray = new Uint8Array(enteredHashBuffer);
  const enteredHash = Array.from(enteredHashArray)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');

  // Сравниваем хеши
  return enteredHash === storedHash;
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
}

export function formatNumber(value: number, decimalPlaces: number = 8): string {
  return value.toFixed(decimalPlaces);
}

export const formatCoinTicker = (ticker: string) => {
  if (ticker === 'USDT_SOL') {
    return 'USDT(SOL)';
  } else if (ticker === 'USDC_SOL') {
    return 'USDC(SOL)';
  }
  return ticker;
};
