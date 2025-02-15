/*import { saveEmailFromPromoToJson } from '@/lib/saveEmailFromPromoToJson'; // Функция сохранения почты
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
}*/

import { connectToDatabase } from '@/lib/mongodb';
import { sendPromoEmail } from '@/lib/emailService';

export async function POST(req) {
  try {
    const data = await req.json(); // Получаем данные формы

    console.log(data);

    // Определим коллекцию в зависимости от формы
    const collectionName = data.youtube || data.telegram || data.instagram || data.rating
      ? 'promotions' // Если пришли данные для промо, используем коллекцию promotions
      : 'subscriptions'; // Если нет данных для промо, то это просто подписка

    // Подключаемся к базе данных
    const db = await connectToDatabase();
    const collection = db.collection(collectionName);

    // Проверка на уникальность email
    const existingEmail = await collection.findOne({ email: data.email });
    if (existingEmail) {
      return new Response(JSON.stringify({ error: 'You are already subscribed' }), { status: 400 });
    }

    // Сохраняем данные в соответствующую коллекцию
    await collection.insertOne(data);

    // Отправляем email через Nodemailer
    await sendPromoEmail(data);

    // Возвращаем успешный ответ
    return new Response(JSON.stringify({ message: 'Subscription successful' }), { status: 200 });
  } catch (error) {
    console.error('Error handling the subscription:', error);
    return new Response(JSON.stringify({ error: 'Error handling the subscription' }), { status: 500 });
  }
}
