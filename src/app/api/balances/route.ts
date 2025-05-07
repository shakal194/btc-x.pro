import { NextResponse } from 'next/server';
import db from '@/db/db';
import { balancesTable } from '@/db/schema';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, coinTicker, coinAmount } = body;

    await db.insert(balancesTable).values({
      user_id: userId,
      coinTicker,
      coinAmount,
      created_at: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving balance:', error);
    return NextResponse.json(
      { error: 'Failed to save balance' },
      { status: 500 },
    );
  }
}
