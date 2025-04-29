import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { getTranslations } from 'next-intl/server';
import { createTranslator } from 'next-intl';


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
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      max-width: 600px;
      margin: 0 auto;
      padding: 0;
      background-color: #f5f5f5;
    }
    .container {
      background-color: #ffffff;
      border-radius: 12px;
      padding: 32px;
      margin: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }
    .header {
      text-align: center;
      margin-bottom: 32px;
      position: relative;
      padding: 24px 0;
      border-bottom: 1px solid #eaeaea;
    }
    .logo-container {
      width: 160px;
      height: 48px;
      margin: 0 auto 24px;
      position: relative;
      overflow: hidden;
      pointer-events: none;
      user-select: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
    }
    .logo {
      width: 100%;
      height: 100%;
      object-fit: contain;
      pointer-events: none;
      user-drag: none;
      -webkit-user-drag: none;
      -webkit-touch-callout: none;
    }
    h1 {
      color: #1a1a1a;
      font-size: 24px;
      font-weight: 600;
      margin: 0 0 16px;
      letter-spacing: -0.5px;
    }
    p {
      margin: 0 0 16px;
      font-size: 16px;
      color: #333;
      line-height: 1.6;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #007AFF;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      margin: 24px 0;
      font-weight: 500;
      text-align: center;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 24px;
      border-top: 1px solid #eaeaea;
      font-size: 13px;
      color: #666;
    }
    .otp-code {
      font-size: 48px;
      font-weight: 700;
      color: #007AFF;
      text-align: center;
      margin: 32px 0;
      padding: 32px;
      background-color: #F5F7FA;
      border-radius: 12px;
      letter-spacing: 12px;
      font-family: 'Courier New', monospace;
      text-shadow: 1px 1px 0 rgba(0, 122, 255, 0.1);
    }
    .data-item {
      margin: 16px 0;
      padding: 16px;
      background-color: #F5F7FA;
      border-radius: 8px;
      border-left: 4px solid #007AFF;
    }
    .data-label {
      font-weight: 600;
      color: #1a1a1a;
      display: block;
      margin-bottom: 4px;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    @media (max-width: 600px) {
      .container {
        margin: 10px;
        padding: 20px;
      }
      .otp-code {
        font-size: 40px;
        padding: 24px;
        letter-spacing: 8px;
      }
      h1 {
        font-size: 22px;
      }
    }
  </style>
`;

const createLogoHtml = () => {
  const siteUrl = NEXT_PUBLIC_SITE_URL || 'https://btc-x.pro';
  return `
    <div class="logo-container" style="background: linear-gradient(to right, rgba(255,255,255,0), rgba(255,255,255,0.1), rgba(255,255,255,0));">
      <img src="${siteUrl}/logo_black.png" 
           alt="BTC-X.PRO Logo" 
           class="logo" 
           style="pointer-events: none; user-select: none; mix-blend-mode: multiply;"
           oncontextmenu="return false;"
      />
    </div>
  `;
};

/*const replacePlaceholders = (text, data) => {
  return text.replace(/{{(\w+)}}/g, (match, key) => data[key] || match);
};*/

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
                ${createLogoHtml()}
                <h1>${t('title')}</h1>
                <div class="otp-code">${otpCode}</div>
              </div>
              <p>${t('greeting')}</p>
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
      //to: 'shakal194@gmail.com',
      to: 'ispitmua@gmail.com',
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
                ${createLogoHtml()}
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
      //to: 'shakal194@gmail.com',
      to: 'ispitmua@gmail.com',
      cc: 'uplinetour@gmail.com',
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
                ${createLogoHtml()}
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

export async function sendWithdrawalOTPEmail(email, otpCode, amount, coinTicker, address) {
  try {
    const t = await getTranslations('emailTemplates.withdrawal');
    const siteUrl = NEXT_PUBLIC_SITE_URL || 'https://btc-x.pro';
    const supportUrl = `${siteUrl}/support`;
    
    const mailOptions = {
      from: SMTP_USER,
      to: email,
      subject: t('title'),
      text: `${t('title')}\n\n${t('initiated')} ${amount} ${coinTicker} ${t('toAddress')}:\n${address}\n\n${t('warning')}\n\n${t('code')}: ${otpCode}\n\n${t('expiration')}\n\n${replacePlaceholders(t('contact'), { supportUrl })}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            ${baseStyles}
            <style>
              .warning-box {
                background-color: #FEF3C7;
                border-left: 4px solid #F59E0B;
                padding: 16px;
                margin: 24px 0;
                border-radius: 8px;
              }
              .warning-box p {
                color: #92400E;
                margin: 0;
              }
              .address-text {
                font-family: 'Courier New', monospace;
                word-break: break-all;
              }
              .expiration-text {
                color: #DC2626;
                font-size: 14px;
                margin-top: 8px;
              }
              .contact-section {
                margin-top: 32px;
              }
              .contact-section a {
                color: #2563EB;
                text-decoration: underline;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                ${createLogoHtml()}
                <h1>${t('title')}</h1>
              </div>
              
              <div class="content">
                <p>${t('initiated')} <strong>${amount} ${coinTicker}</strong> ${t('toAddress')}:</p>
                <div class="data-item">
                  <span class="data-label">${t('addressLabel')}</span>
                  <span class="address-text">${address}</span>
                </div>
                
                <div class="warning-box">
                  <p>${t('warning')}</p>
                </div>

                <div class="otp-section">
                  <p>${t('code')}:</p>
                  <div class="otp-code">${otpCode}</div>
                  <p class="expiration-text">${t('expiration')}</p>
                </div>

                <div class="contact-section">
                  <p>${t('contact')}</p>
                </div>
              </div>

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
      message: 'Withdrawal OTP email sent successfully'
    };
  } catch (error) {
    console.error('Error sending withdrawal OTP email:', error);
    throw new Error('Failed to send withdrawal OTP email');
  }
}

export async function sendSupportEmail(email, message) {
  try {
    const messages = (await import(`@/dictionaries/ru.json`)).default;
    const t = createTranslator({ locale: 'ru', messages, namespace: 'emailTemplates.support' });
    
    const mailOptions = {
      from: SMTP_USER,
      //to: 'shakal194@gmail.com',
      to: 'ispitmua@gmail.com',
      cc: 'uplinetour@gmail.com',
      subject: t('title'),
      text: `${t('content')}\nEmail: ${email}\n${t('message_label')}: ${message}`,
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
                ${createLogoHtml()}
                <h1>${t('title')}</h1>
              </div>
              <p>${t('content')}</p>
              <div class="data-item">
                <span class="data-label">Email:</span> ${email}
              </div>
              <div class="data-item">
                <span class="data-label">${t('message_label')}:</span>
                <p style="white-space: pre-wrap;">${message}</p>
              </div>
              <div class="footer">
                <p>${t('footer')}</p>
                <p>${t('copyright')}</p>
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