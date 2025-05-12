import db from '@/db/db';
import { promoSubscriptionsTable } from '@/db/schema';
import { sendPromoEmail } from '@/lib/emailService';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { email, youtube, telegram, instagram } = data;

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email is required',
        },
        { status: 400 },
      );
    }

    // Проверяем существование подписки
    const existingSubscription = await db
      .select()
      .from(promoSubscriptionsTable)
      .where(eq(promoSubscriptionsTable.email, email))
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
    await db.insert(promoSubscriptionsTable).values({
      email,
      youtube: youtube || null,
      telegram: telegram || null,
      instagram: instagram || null,
      isActive: true,
    });

    // Отправляем email
    const emailResult = await sendPromoEmail(data);

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
    console.error('Error handling promo subscription:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 },
    );
  }
}
