import nodemailer from 'nodemailer';

// Создаем общий транспортер для всех функций
const transporter = nodemailer.createTransport({
  host: 'mx1.mirohost.net',
  port: 587,
  secure: false,
  auth: {
    user: 'noreply@btc-x.pro',
    pass: '7lm7KqmoyYak'
  }
});

export async function sendOTPEmail(email, otpCode) {
  try {
    const mailOptions = {
      from: 'noreply@btc-x.pro',
      to: email,
      subject: 'Your OTP Code for Cloud-Mining BTC-X.PRO',
      text: `Your OTP code is: ${otpCode}\nThis code will expire in 30 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your OTP Code</h2>
          <p>Your one-time password for <a href="https://btc-x.pro/cloud-mining">Cloud-Mining BTC-X.PRO</a> is:</p>
          <h1 style="font-size: 32px; letter-spacing: 5px; color: #2563eb;">${otpCode}</h1>
          <p>This code will expire in 30 minutes.</p>
          <p style="color: #666;">If you didn't request this code, please ignore this email.</p>
        </div>
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
    const mailOptions = {
      from: 'noreply@btc-x.pro',
      to: 'ispitmua@gmail.com',
      cc: 'uplinetour@gmail.com',
      subject: 'BTCXtoUSDT',
      text: `YouTube: ${data.youtube}\nTelegram: ${data.telegram}\nInstagram: ${data.instagram}\nRating: ${data.rating}\nEmail: ${data.email}`,
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
    const mailOptions = {
      from: 'noreply@btc-x.pro',
      to: 'ispitmua@gmail.com',
      cc: 'uplinetour@gmail.com',
      subject: 'BTC-XNewSubscribe!',
      text: `New subscriber - ${email}`,
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
    const mailOptions = {
      from: 'noreply@btc-x.pro',
      to: 'ispitmua@gmail.com',
      cc: 'uplinetour@gmail.com',
      subject: 'BTC-XDelete!',
      text: `New request to delete account - ${email}`,
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