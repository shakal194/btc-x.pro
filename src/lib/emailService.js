/*import emailjs from 'emailjs-com';

export const sendEmail = async (data) => {
  try {
    const result = await emailjs.send(
      'service_9b67mnb',
      'template_zj7igvd1',
      data,
      'ERgYQ6pRerUh47zDO',
    );

      console.log('Success sending email:', result);
    return { success: true, result };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
};
*/

import nodemailer from 'nodemailer';

export async function sendPromoEmail(data) {
  try {
    // Создаем транспортер для отправки email через Gmail SMTP сервер
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, // Ваш Gmail адрес
        pass: process.env.GMAIL_PASS,   // Ваш Gmail пароль
      },
    });

    // Настройки письма
    const mailOptions = {
      from: '"BTCXtoUSDT" <shakal194@gmail.com>', // Отправитель
      to: 'ispitmua@gmail.com',               // Получатель
      cc: 'uplinetour@gmail.com',               // Получатель копия
      subject: 'BTCXtoUSDT', // Тема письма
      text: `YouTube: ${data.youtube}\nTelegram: ${data.telegram}\nInstagram: ${data.instagram}\nRating: ${data.rating}\nEmail: ${data.email}`, // Текст письма
    };

    console.log('Sending email with data:', data);

    // Отправляем email
      const info = await transporter.sendMail(mailOptions);
      console.log(info);
    console.log('Email sent successfully:', info.response);
    return {
      status: 200,
      message: 'Email sent successfully',
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      status: 500,
      message: 'Error sending email',
    };
  }
}

export async function sendSubscriptionEmail(email) {
  try {
    // Создаем транспортер для отправки email через Gmail SMTP сервер
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,  // Ваш Gmail адрес
        pass: process.env.GMAIL_PASS,    // Ваш Gmail пароль (или использование App Password для безопасности)
      },
    });

    // Настройки письма
    const mailOptions = {
      from: '"BTC-XNewSubscribe!" <shakal194@gmail.com>',   // Отправитель
      to: 'ispitmua@gmail.com',                      // Получатель
      cc: 'uplinetour@gmail.com',               // Получатель копия
      subject: 'BTC-XNewSubscribe!', // Тема письма (изменена)
      text: `New subscriber - ${email}`,
    };

    // Отправляем email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);
    return {
      status: 200,
      message: 'Email sent successfully',
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      status: 500,
      message: 'Error sending email',
    };
  }
}