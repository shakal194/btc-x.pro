import db from '@/db/db';
import { balancesTable, depositsTable, usersAddressTable } from '@/db/schema';
import { getAccessToken, getTransfers } from '@/lib/coinsbuy';
import { eq, and, desc } from 'drizzle-orm';
import { getWalletId, COIN_CONFIG } from '@/lib/constants';

// Функция для форматирования даты и времени
const formatDateTime = () => {
  const now = new Date();
  return now.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

function formatDate(dateString: string): Date {
  const date = new Date(dateString);
  // Convert to UTC
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
  );
}

const getCurrencyName = (id: string): string => {
  const coin = Object.entries(COIN_CONFIG).find(
    ([_, config]) => config.currencyId === id,
  );
  return coin ? coin[0] : 'Unknown';
};

const getStatusText = (status: number): string => {
  switch (status) {
    case -3:
      return 'canceled';
    case -2:
      return 'blocked';
    case -1:
      return 'failed';
    case 0:
      return 'created';
    case 1:
      return 'unconfirmed';
    case 2:
      return 'confirmed';
    default:
      return 'unknown';
  }
};

export async function checkAndProcessDeposits() {
  try {
    console.log(`[${formatDateTime()}] 🔄 Starting deposit check process...`);

    // Получаем токен для API
    const token = await getAccessToken();

    // Получаем все транзакции
    console.log(`[${formatDateTime()}] 📥 Fetching all transfers from API...`);
    const response = await getTransfers(token);
    const transfers = response.data;
    console.log(
      `[${formatDateTime()}] 📊 Received ${transfers.length} transfers from API`,
    );

    const userAddresses = await db.select().from(usersAddressTable);

    for (const userAddress of userAddresses) {
      const expectedWalletId = getWalletId(userAddress.coinTicker);

      const relevantTransfers = transfers.filter(
        (transfer: {
          relationships: {
            wallet: { data: { id: string } };
            currency: { data: { id: string } };
          };
          attributes: {
            op_id: number;
            op_type: number;
            status: number;
            amount_target: string;
            created_at: string;
            updated_at: string;
          };
        }) =>
          transfer.relationships.wallet.data.id === expectedWalletId &&
          transfer.attributes.op_id.toString() === userAddress.depositId &&
          transfer.attributes.op_type === 1 &&
          getCurrencyName(transfer.relationships.currency.data.id) ===
            userAddress.coinTicker,
      );

      for (const transfer of relevantTransfers) {
        const transferId = parseInt(transfer.id);
        const amount = transfer.attributes.amount_target;
        const status = getStatusText(transfer.attributes.status);
        const createdAt = formatDate(transfer.attributes.created_at);
        const updatedAt = formatDate(transfer.attributes.updated_at);

        console.log(
          `\n[${formatDateTime()}] 💰 Processing transfer ID: ${transferId}`,
        );
        console.log(
          `[${formatDateTime()}]    Amount: ${amount} ${userAddress.coinTicker}`,
        );
        console.log(`[${formatDateTime()}]    Status: ${status}`);
        console.log(`[${formatDateTime()}]    Created at: ${createdAt}`);
        console.log(`[${formatDateTime()}]    Updated at: ${updatedAt}`);

        // Проверяем, существует ли уже запись о депозите
        const existingDeposit = await db
          .select()
          .from(depositsTable)
          .where(eq(depositsTable.depositId, transferId))
          .limit(1);

        if (existingDeposit.length === 0) {
          console.log(
            `[${formatDateTime()}]    ➕ Creating new deposit record...`,
          );
          await db.insert(depositsTable).values({
            depositId: transferId,
            user_id: userAddress.user_id,
            coinTicker: userAddress.coinTicker,
            amount: amount,
            status: status,
            created_at: createdAt,
            updated_at: updatedAt,
          });
          console.log(`[${formatDateTime()}]    ✅ New deposit record created`);

          // Если статус подтвержден, обновляем баланс
          if (status === 'confirmed') {
            console.log(
              `[${formatDateTime()}]    💎 Transfer is confirmed, updating balance...`,
            );

            // Получаем текущий баланс
            const currentBalance = await db
              .select()
              .from(balancesTable)
              .where(
                and(
                  eq(balancesTable.user_id, userAddress.user_id),
                  eq(balancesTable.coinTicker, userAddress.coinTicker),
                ),
              )
              .orderBy(desc(balancesTable.id))
              .limit(1);

            const newBalance =
              currentBalance.length > 0
                ? (
                    Number(currentBalance[0].coinAmount) + Number(amount)
                  ).toString()
                : amount;

            console.log(
              `[${formatDateTime()}]    💰 Creating new balance record with amount ${newBalance} (previous: ${currentBalance.length > 0 ? currentBalance[0].coinAmount : '0'}, deposit: ${amount})`,
            );

            // Создаем новую запись с обновленным балансом
            await db.insert(balancesTable).values({
              user_id: userAddress.user_id,
              coinTicker: userAddress.coinTicker,
              coinAmount: newBalance,
            });

            console.log(
              `[${formatDateTime()}]    ✅ New balance record created`,
            );
          }
        } else {
          if (existingDeposit[0].status !== status) {
            console.log(
              `[${formatDateTime()}]    🔄 Updating deposit status from ${existingDeposit[0].status} to ${status}`,
            );
            await db
              .update(depositsTable)
              .set({
                status: status,
                updated_at: updatedAt,
              })
              .where(eq(depositsTable.depositId, transferId));
            console.log(
              `[${formatDateTime()}]    ✅ Status updated successfully`,
            );

            // Если статус изменился на confirmed, обновляем баланс
            if (
              status === 'confirmed' &&
              existingDeposit[0].status !== 'confirmed'
            ) {
              console.log(
                `[${formatDateTime()}]    💎 Transfer is now confirmed, updating balance...`,
              );

              // Получаем текущий баланс
              const currentBalance = await db
                .select()
                .from(balancesTable)
                .where(
                  and(
                    eq(balancesTable.user_id, userAddress.user_id),
                    eq(balancesTable.coinTicker, userAddress.coinTicker),
                  ),
                )
                .orderBy(desc(balancesTable.id))
                .limit(1);

              const newBalance =
                currentBalance.length > 0
                  ? (
                      Number(currentBalance[0].coinAmount) + Number(amount)
                    ).toString()
                  : amount;

              console.log(
                `[${formatDateTime()}]    💰 Creating new balance record with amount ${newBalance} (previous: ${currentBalance.length > 0 ? currentBalance[0].coinAmount : '0'}, deposit: ${amount})`,
              );

              // Создаем новую запись с обновленным балансом
              await db.insert(balancesTable).values({
                user_id: userAddress.user_id,
                coinTicker: userAddress.coinTicker,
                coinAmount: newBalance,
              });

              console.log(
                `[${formatDateTime()}]    ✅ New balance record created`,
              );
            }
          } else {
            console.log(`[${formatDateTime()}]    ℹ️ Deposit status unchanged`);
          }
        }
      }
    }
    console.log(
      `\n[${formatDateTime()}] ✅ Deposit check process completed successfully`,
    );
  } catch (error) {
    console.error(
      `[${formatDateTime()}] ❌ Error during deposit check:`,
      error,
    );
    throw error;
  }
}
