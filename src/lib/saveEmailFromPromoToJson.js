import fs from 'fs';
import path from 'path';

export async function saveEmailFromPromoToJson(email, formData) {
  try {
    // Путь к файлу с подписанными email
    const filePath = path.resolve('subscribe_data', 'emails_promo.json');

    // Чтение текущих данных
    let emails = [];
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, 'utf-8');
      emails = JSON.parse(fileData);
    }

    // Проверка, существует ли уже такая почта
    const emailExists = emails.some((entry) => entry.email === email);
    if (emailExists) {
      throw new Error('You are already subscribed');
    }

    // Добавление всех данных из формы
    emails.push({
      email,
      youtube: formData.youtube,
      telegram: formData.telegram,
      instagram: formData.instagram,
      rating: formData.rating,
    });

    // Перезапись файла с новыми данными
    fs.writeFileSync(filePath, JSON.stringify(emails, null, 2));
    return { status: 200, message: 'Email saved successfully' };
  } catch (error) {
    console.error('Error saving email to file:', error.message);
    return { status: 400, message: error.message };
  }
}
