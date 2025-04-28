import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { getTranslations } from 'next-intl/server';


dotenv.config();

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, NEXT_PUBLIC_SITE_URL } = process.env;

// Создаем общий транспортер для всех функций
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS
  }
});

const baseStyles = `
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .container {
      background-color: #f9f9f9;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .header {
      text-align: center;
      margin-bottom: 20px;
    }
    .logo {
      max-width: 200px;
      height: auto;
      margin-bottom: 20px;
    }
    h1 {
      color: #2c3e50;
      font-size: 24px;
      margin-bottom: 20px;
    }
    p {
      margin-bottom: 15px;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #3498db;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      font-size: 12px;
      color: #666;
    }
    .otp-code {
      font-size: 32px;
      font-weight: bold;
      color: #2c3e50;
      text-align: center;
      margin: 20px 0;
      padding: 15px;
      background-color: #f0f0f0;
      border-radius: 4px;
      letter-spacing: 5px;
    }
    .data-item {
      margin: 10px 0;
      padding: 10px;
      background-color: #f0f0f0;
      border-radius: 4px;
    }
    .data-label {
      font-weight: bold;
      color: #2c3e50;
    }
  </style>
`;

const getLogoUrl = () => {
  const siteUrl = NEXT_PUBLIC_SITE_URL || 'https://btc-x.pro';
  return `${siteUrl}/logo_black.png`;
};

const replacePlaceholders = (text, data) => {
  return text.replace(/{{(\w+)}}/g, (match, key) => data[key] || match);
};

export async function sendOTPEmail(email, otpCode) {
  try {
    const t = await getTranslations('emailTemplates.otp');
    
    const mailOptions = {
      from: SMTP_USER,
      to: email,
      subject: t('title'),
      text: `${replacePlaceholders(t('greeting'), { email })}\n${t('content')} ${otpCode}\n${t('expiration')}\n${t('ignore')}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            ${baseStyles}
          </head>
          <body>
            <div class="container">
              <div class="header">
                <img src="${getLogoUrl()}" alt="BTC-X.PRO Logo" class="logo">
                <h1>${t('title')}</h1>
                <div class="otp-code">${otpCode}</div>
              </div>
              <p>${replacePlaceholders(t('greeting'), { email })}</p>
              <p>${t('content')}</p>
              <p>${t('expiration')}</p>
              <p>${t('ignore')}</p>
              <div class="footer">
                <p>${t('footer')}</p>
                <p>${t('copyright')}</p>
              </div>
            </div>
          </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    return {
      status: 200,
      message: 'OTP email sent successfully'
    };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP email');
  }
}

export async function sendPromoEmail(data) {
  try {
    const dict = await getTranslations('emailTemplates.promo');
    const t = dict.emailTemplates.promo;

    const mailOptions = {
      from: SMTP_USER,
      to: 'shakal194@gmail.com',
      cc: 'uplinetour@gmail.com',
      subject: t.title,
      text: `YouTube: ${data.youtube}\nTelegram: ${data.telegram}\nInstagram: ${data.instagram}\nRating: ${data.rating}\nEmail: ${data.email}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            ${baseStyles}
          </head>
          <body>
            <div class="container">
              <div class="header">
                <img src="${getLogoUrl()}" alt="BTC-X.PRO Logo" class="logo">
                <h1>${t.title}</h1>
              </div>
              <p>${t.content}</p>
              <div class="data-item">
                <span class="data-label">Email:</span> ${data.email}
              </div>
              ${data.youtube ? `<div class="data-item"><span class="data-label">YouTube:</span> ${data.youtube}</div>` : ''}
              ${data.telegram ? `<div class="data-item"><span class="data-label">Telegram:</span> ${data.telegram}</div>` : ''}
              ${data.instagram ? `<div class="data-item"><span class="data-label">Instagram:</span> ${data.instagram}</div>` : ''}
              ${data.rating ? `<div class="data-item"><span class="data-label">Rating:</span> ${data.rating}</div>` : ''}
              <div class="footer">
                <p>${t.footer}</p>
                <p>${t.copyright}</p>
              </div>
            </div>
          </body>
        </html>
      `
    };

    console.log('Sending email with data:', data);

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

export async function sendSubscriptionEmail(email) {
  try {
    const dict = await getTranslations('emailTemplates.newsletter');
    const t = dict.emailTemplates.newsletter;

    const mailOptions = {
      from: SMTP_USER,
      to: 'shakal194@gmail.com',
      subject: t.title,
      text: `New subscriber - ${email}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            ${baseStyles}
          </head>
          <body>
            <div class="container">
              <div class="header">
                <img src="${getLogoUrl()}" alt="BTC-X.PRO Logo" class="logo">
                <h1>${t.title}</h1>
              </div>
              <p>${t.content}</p>
              <div class="data-item">
                <span class="data-label">Email:</span> ${email}
              </div>
              <div class="footer">
                <p>${t.footer}</p>
                <p>${t.copyright}</p>
              </div>
            </div>
          </body>
        </html>
      `
    };

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

export async function sendDeleteEmail(email) {
  try {
    const dict = await getTranslations('emailTemplates.delete');
    const t = dict.emailTemplates.delete;

    const mailOptions = {
      from: SMTP_USER,
      to: 'ispitmua@gmail.com',
      cc: 'uplinetour@gmail.com',
      subject: t.title,
      text: `New request to delete account - ${email}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            ${baseStyles}
          </head>
          <body>
            <div class="container">
              <div class="header">
                <img src="${getLogoUrl()}" alt="BTC-X.PRO Logo" class="logo">
                <h1>${t.title}</h1>
              </div>
              <p>${t.content}</p>
              <div class="data-item">
                <span class="data-label">Email:</span> ${email}
              </div>
              <div class="footer">
                <p>${t.footer}</p>
                <p>${t.copyright}</p>
              </div>
            </div>
          </body>
        </html>
      `
    };

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