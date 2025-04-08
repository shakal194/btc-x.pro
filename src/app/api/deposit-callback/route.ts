import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { updateUserBalance } from '@/lib/balance';

const API_SECRET = process.env.COINSBUY_API_SECRET as string;

// Функция для проверки подписи
const verifySignature = (signature: string, body: string): boolean => {
  const expectedSignature = crypto
    .createHmac('sha256', API_SECRET)
    .update(body)
    .digest('hex');
  return signature === expectedSignature;
};

export async function POST(request: Request) {
  try {
    // Получаем тело запроса и подпись
    const body = await request.text();
    const signature = request.headers.get('X-Signature');

    // Проверяем наличие подписи
    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }

    // Проверяем подпись
    if (!verifySignature(signature, body)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Парсим тело запроса
    const data = JSON.parse(body);

    // Получаем важные данные из колбэка
    const {
      attributes: { status, tracking_id, amount, currency },
    } = data.data;

    // Обрабатываем разные статусы транзакции
    switch (status) {
      case 'success': {
        try {
          // Извлекаем email пользователя из tracking_id
          const userEmail = tracking_id.replace('dep_', '').split('_')[0];

          // Обновляем баланс пользователя
          await updateUserBalance({
            userEmail,
            amount,
            coinTicker: currency,
          });

          console.log(
            `Deposit successful: ${amount} ${currency} for user ${userEmail}`,
          );
        } catch (error) {
          console.error('Error processing successful deposit:', error);
          // Возвращаем 500, чтобы CoinsbuyPay повторил попытку позже
          return NextResponse.json(
            { error: 'Failed to process deposit' },
            { status: 500 },
          );
        }
        break;
      }

      case 'pending':
        console.log(`Deposit pending: ${amount} ${currency}`);
        break;

      case 'processing':
        console.log(`Deposit processing: ${amount} ${currency}`);
        break;

      case 'error':
        console.error(`Deposit failed: ${amount} ${currency}`);
        break;

      default:
        console.warn(`Unknown deposit status: ${status}`);
    }

    // Отправляем успешный ответ
    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Error processing deposit callback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
