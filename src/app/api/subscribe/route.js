
import { saveEmailToJson } from '@/lib/saveEmailToJson';

export async function POST(req) {
  try {
    // Получаем данные из тела запроса
    const { email } = await req.json();

    // Сохраняем email в JSON файл
    const response = await saveEmailToJson(email);

    // Если email успешно сохранен, отправляем успешный ответ
    if (response.status === 200) {
      return new Response(JSON.stringify({ message: response.message }), { status: 200 });
    } else {
      // В случае ошибки с сохранением email
      return new Response(JSON.stringify({ error: response.message }), { status: 400 });
    }
  } catch (error) {
    // В случае других ошибок
    console.error('Error handling the subscription:', error);
    return new Response(JSON.stringify({ error: 'Error handling the subscription' }), { status: 500 });
  }
}