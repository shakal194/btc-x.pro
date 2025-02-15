/*import { saveEmailToJson } from '@/lib/saveEmailToJson';

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
}*/

// [project]/src/app/api/subscribe/route.js

// src/app/api/subscribe/route.js

// src/app/api/subscribe/route.js

import { connectToDatabase } from '@/lib/mongodb';
import { sendSubscriptionEmail } from '@/lib/emailService';

export async function POST(req) {
  try {
    const data = await req.json(); // Получаем данные формы

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
    await sendSubscriptionEmail(data.email);

    // Возвращаем успешный ответ
    return new Response(JSON.stringify({ message: 'Subscription successful' }), { status: 200 });
  } catch (error) {
    console.error('Error handling the subscription:', error);
    return new Response(JSON.stringify({ error: 'Error handling the subscription' }), { status: 500 });
  }
}


