import { sendSupportEmail } from '@/lib/emailService';

export async function POST(req) {
  try {
    const { email, message } = await req.json();

    if (!email || !message) {
      return new Response(JSON.stringify({ message: 'Email, message are required' }), { status: 400 });
    }

    const response = await sendSupportEmail(email, message);

    if (response.status === 200) {
      return new Response(JSON.stringify({ message: 'Email sent successfully' }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ message: response.message }), { status: response.status });
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(JSON.stringify({ message: 'Error sending email' }), { status: 500 });
  }
} 