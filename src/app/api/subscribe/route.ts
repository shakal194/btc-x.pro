import db from '@/db/db';
import { newsletterSubscriptionsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { sendSubscriptionEmail } from '@/lib/emailService';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // Проверяем существование подписки
    const existingSubscription = await db
      .select()
      .from(newsletterSubscriptionsTable)
      .where(eq(newsletterSubscriptionsTable.email, email))
      .limit(1);

    if (existingSubscription.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'You are already subscribed',
        },
        { status: 400 },
      );
    }

    // Добавляем новую подписку
    await db.insert(newsletterSubscriptionsTable).values({
      email,
      isActive: true,
    });

    // Отправляем email
    const emailResult = await sendSubscriptionEmail(email);

    if (emailResult.status !== 200) {
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to send confirmation email',
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Subscription successful',
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error handling subscription:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 },
    );
  }
}
