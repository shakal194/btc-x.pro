import { saveEmailFromPromoToJson } from '@/lib/saveEmailFromPromoToJson'; // Функция сохранения почты
import { sendEmail } from '@/lib/emailService'; // Функция для отправки email
import { NextResponse } from 'next/server'; // Используем NextResponse

export async function POST(req) {
  try {
    // Получаем данные формы из тела запроса
    const data = await req.json();

    // Сначала пытаемся сохранить email в файл с остальными данными
    const saveResponse = await saveEmailFromPromoToJson(data.email, data); // передаем все данные формы
    if (saveResponse.status !== 200) {
      return NextResponse.json({ error: saveResponse.message }, { status: 400 });
    }

    // Если почта сохранена, отправляем email
    const response = await sendEmail(data);

    // Возвращаем успешный ответ
   if (response.status === 200) {
      return new Response(JSON.stringify({ message: response.message }), { status: 200 });
    } else {
      // В случае ошибки с сохранением email
      return new Response(JSON.stringify({ error: response.message }), { status: 400 });
    }
  } catch (error) {
    console.error('Error handling subscription:', error);
    return NextResponse.json({ error: 'Error handling the subscription' }, { status: 500 });
  }
}