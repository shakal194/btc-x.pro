'use server';

import db from '@/db/db';
import {
  balancesTable,
  depositsTable,
  usersTable,
  usersAddressTable,
} from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { getToken, createDeposit } from '@/lib/coinsbuy';
import { getWalletId } from './constants';

interface UpdateBalanceParams {
  userEmail: string;
  amount: string | number;
  coinTicker: string;
}

/**
 * Обновляет баланс пользователя и создает запись о депозите
 * @param {UpdateBalanceParams} params - Параметры для обновления баланса
 * @returns {Promise<{ success: boolean; message: string; }>}
 */
export async function updateUserBalance({
  userEmail,
  amount,
  coinTicker,
}: UpdateBalanceParams): Promise<{ success: boolean; message: string }> {
  try {
    return await db.transaction(async (tx) => {
      // 1. Получаем пользователя по email
      const user = await tx
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, userEmail))
        .limit(1);

      if (!user.length) {
        throw new Error(`User not found: ${userEmail}`);
      }

      const userId = user[0].id;

      // 2. Проверяем существующий баланс
      const existingBalance = await tx
        .select()
        .from(balancesTable)
        .where(
          and(
            eq(balancesTable.user_id, userId),
            eq(balancesTable.coinTicker, coinTicker),
          ),
        )
        .limit(1);

      if (existingBalance.length) {
        // 3a. Обновляем существующий баланс
        const currentBalance = existingBalance[0].coinAmount;
        const newBalance = Number(currentBalance) + Number(amount);

        await tx
          .update(balancesTable)
          .set({
            coinAmount: newBalance.toString(),
          })
          .where(
            and(
              eq(balancesTable.user_id, userId),
              eq(balancesTable.coinTicker, coinTicker),
            ),
          );
      } else {
        // 3b. Создаем новую запись баланса
        await tx.insert(balancesTable).values({
          user_id: userId,
          coinTicker,
          coinAmount: amount.toString(),
          created_at: new Date(),
        });
      }

      // 4. Создаем запись о депозите
      const depositId = Number(
        `${Date.now()}${Math.floor(Math.random() * 1000)}`,
      );
      await tx.insert(depositsTable).values({
        user_id: userId,
        coinTicker,
        amount: amount.toString(),
        status: 'confirmed', // Статус "зачислен"
        depositId,
        created_at: new Date(),
        updated_at: new Date(),
      });

      return {
        success: true,
        message: `Balance updated successfully: ${amount} ${coinTicker} for user ${userEmail}`,
      };
    });
  } catch (error) {
    console.error('Error updating balance:', error);
    throw new Error(
      `Failed to update balance for user ${userEmail}: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    );
  }
}

/**
 * Получает текущий баланс пользователя по email и тикеру монеты
 * @param {string} userEmail - Email пользователя
 * @param {string} coinTicker - Тикер монеты (например, 'BTC', 'USDT')
 * @returns {Promise<number>} Текущий баланс
 */
export async function getUserBalance(
  userEmail: string,
  coinTicker: string,
): Promise<number> {
  try {
    // 1. Получаем пользователя по email
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, userEmail))
      .limit(1);

    if (!user.length) {
      throw new Error(`User not found: ${userEmail}`);
    }

    // 2. Получаем баланс
    const balance = await db
      .select()
      .from(balancesTable)
      .where(
        and(
          eq(balancesTable.user_id, user[0].id),
          eq(balancesTable.coinTicker, coinTicker),
        ),
      )
      .limit(1);

    return balance.length ? Number(balance[0].coinAmount) : 0;
  } catch (error) {
    console.error('Error getting user balance:', error);
    throw new Error(
      `Failed to get balance for user ${userEmail}: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    );
  }
}

export async function getDepositAddress(userId: number, coinTicker: string) {
  try {
    const result = await db
      .select({
        depositAddress: usersAddressTable.depositAddress,
        depositId: usersAddressTable.depositId,
      })
      .from(usersAddressTable)
      .where(
        sql`${usersAddressTable.user_id} = ${userId} AND ${usersAddressTable.coinTicker} = ${coinTicker}`,
      )
      .limit(1);

    if (result.length > 0) {
      return {
        depositAddress: result[0].depositAddress,
        depositId: result[0].depositId,
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching deposit address:', error);
    return null;
  }
}

export async function saveAddress(
  userId: number,
  coinTicker: string,
  depositAddress: string,
  depositId: string,
) {
  try {
    // Проверяем, существует ли уже адрес для этой монеты у пользователя
    const existingAddress = await getDepositAddress(userId, coinTicker);
    if (existingAddress) {
      return { success: true };
    }

    // Если адреса нет, создаем новый
    await db.insert(usersAddressTable).values({
      user_id: userId,
      coinTicker,
      depositAddress,
      depositId,
    });
    return { success: true };
  } catch (error) {
    console.error('Error saving address:', error);
    throw error;
  }
}

// Функция для создания депозита при покупке долей
export async function createDepositForCoin(
  userId: number,
  userEmail: string,
  coinTicker: string,
) {
  try {
    // Проверяем, есть ли уже депозит
    const existingDeposit = await getDepositAddress(userId, coinTicker);
    if (existingDeposit?.depositAddress && existingDeposit?.depositId) {
      return existingDeposit;
    }

    // Получаем токен доступа
    const token = await getToken();

    // Создаем новый депозит
    const response = await createDeposit(token, {
      label: `Create address ${userId}`,
      tracking_id: `Create address ${userEmail}`,
      relationships: {
        wallet: {
          data: { type: 'wallet', id: getWalletId(coinTicker) },
        },
      },
    });

    if (!response.data?.attributes?.address || !response.data?.id) {
      throw new Error('Failed to create deposit address');
    }

    // Сохраняем адрес в новую таблицу
    await saveAddress(
      userId,
      coinTicker,
      response.data.attributes.address,
      response.data.id,
    );

    return {
      depositAddress: response.data.attributes.address,
      depositId: response.data.id,
    };
  } catch (error) {
    console.error('Error creating deposit for coin:', error);
    throw error;
  }
}

export async function fetchDepositAddress(
  userId: number,
  coinTicker: string,
): Promise<string> {
  try {
    const result = await getDepositAddress(userId, coinTicker);
    if (!result || !result.depositAddress) {
      throw new Error('Deposit address not found');
    }
    return result.depositAddress;
  } catch (error) {
    console.error('Error fetching deposit address:', error);
    throw error;
  }
}
