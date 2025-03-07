import { sendDeleteEmail } from '@/lib/emailService';

export async function POST(req) {
  const { email } = await req.json();

  if (!email) {
    return new Response(JSON.stringify({ message: 'Email is required' }), { status: 400 });
  }

  try {
    const response = await sendDeleteEmail(email);

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
