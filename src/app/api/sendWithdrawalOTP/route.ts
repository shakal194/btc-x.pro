import { NextResponse } from 'next/server';
import { sendWithdrawalOTPEmail } from '@/lib/emailService';
import db from '@/db/db';
import { otpCodesTable } from '@/db/schema';
import { sql } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const { email, otpCode, amount, coinTicker, address, locale } =
      await request.json();

    if (!email || !otpCode || !amount || !coinTicker || !address || !locale) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    // Delete any existing OTP codes for this email
    await db
      .delete(otpCodesTable)
      .where(sql`${otpCodesTable.email} = ${email}`);

    // Calculate expiration time (30 minutes from now)
    const expiredAt = new Date();
    expiredAt.setMinutes(expiredAt.getMinutes() + 30);

    // Save new OTP code to database
    await db.insert(otpCodesTable).values({
      email,
      otpCode,
      expiredAt,
      createdAt: new Date(),
    });

    // Send email with OTP
    await sendWithdrawalOTPEmail(email, otpCode, amount, coinTicker, address);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP email' },
      { status: 500 },
    );
  }
}
