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

export async function sendEmail(data) {
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
      from: process.env.GMAIL_USER, // Отправитель
      to: 'ispitmua@gmail.com',               // Получатель
      subject: 'BTCXtoUSDT', // Тема письма
      text: `YouTube: ${data.youtube}\nTelegram: ${data.telegram}\nInstagram: ${data.instagram}\nRating: ${data.rating}\nEmail: ${data.email}`, // Текст письма
    };

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
        user: 'shakal194@gmail.com',  // Ваш Gmail адрес
        pass: 'gkno jfhe kyvv sokl',    // Ваш Gmail пароль (или использование App Password для безопасности)
      },
    });

    // Настройки письма
    const mailOptions = {
      from: 'shakal194@gmail.com',   // Отправитель
      to: 'ispitmua@gmail.com',                      // Получатель
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