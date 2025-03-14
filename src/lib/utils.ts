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
