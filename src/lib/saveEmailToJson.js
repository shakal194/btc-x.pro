import fs from 'fs';
import path from 'path';

export async function saveEmailToJson(email) {
  try {
    // Путь к файлу, в который будем сохранять email
    const filePath = path.resolve('subscribe_data', 'emails.json');

    // Читаем файл с сохраненными email-адресами
    let emails = [];
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, 'utf-8');
      emails = JSON.parse(fileData);
    }

    // Проверка, если email уже существует
    const emailExists = emails.some((entry) => entry.email === email);
    if (emailExists) {
      throw new Error('You are already subscribed');
    }

    // Добавляем новый email в массив
    emails.push({ email });

    // Записываем обновленные данные обратно в файл
    fs.writeFileSync(filePath, JSON.stringify(emails, null, 2));
    console.log('Email saved successfully');
    return { status: 200, message: 'Email saved successfully' };
  } catch (error) {
    console.error('Error saving email to file:', error.message);
    return { status: 400, message: error.message };
  }
}