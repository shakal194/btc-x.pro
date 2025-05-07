import 'dotenv/config';
import db from '@/db/db';
import {
  usersTable,
  equipmentsTable,
  algorithmTable,
  balancesTable,
  miningRewardsTable,
} from '@/db/schema';
import { and, desc, eq } from 'drizzle-orm';
import {
  fetchElectricityPrice,
  fetchAllUserBalanceShares,
  fetchCoinPrice,
} from '@/lib/data';

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

async function fetchUserMiningData() {
  try {
    const users = await db.select().from(usersTable);
    const equipments = await db.select().from(equipmentsTable);
    const algorithms = await db.select().from(algorithmTable);
    const electricityPrices = await fetchElectricityPrice();

    return {
      users,
      equipments,
      algorithms,
      electricityPrices,
    };
  } catch (error) {
    console.error('Error fetching mining data:', error);
    throw error;
  }
}

export async function calculateAndInsertMiningRewards() {
  try {
    // Получаем все необходимые данные
    const { users, equipments, algorithms, electricityPrices } =
      await fetchUserMiningData();

    // Получаем текущие цены монет
    const coinPrices: Record<string, number> = {};
    for (const algorithm of algorithms) {
      if (!algorithm.coinTickers) continue;
      for (const coinTicker of algorithm.coinTickers) {
        const price = await fetchCoinPrice(coinTicker.name);
        coinPrices[coinTicker.name] = price;
      }
    }

    // Для каждого пользователя
    for (const user of users) {
      // Получаем доли пользователя
      const userShares = await fetchAllUserBalanceShares(user.id);

      // Создаем мапу для хранения хешрейта по алгоритмам
      const algorithmHashrate = new Map<number, number>();
      const algorithmPower = new Map<number, number>();

      // Считаем общий хешрейт и мощность по алгоритмам
      for (const [equipmentId, share] of Object.entries(userShares)) {
        const equipment = equipments.find((e) => e.id === Number(equipmentId));
        if (!equipment) continue;

        const algorithm = algorithms.find(
          (a) => a.id === equipment.algorithm_id,
        );
        if (!algorithm) continue;

        // Рассчитываем хешрейт для долей пользователя
        const hashratePerShare = equipment.hashrate / equipment.shareCount;
        const userHashrate = hashratePerShare * share.balanceShareCount;

        // Рассчитываем мощность для долей пользователя
        const powerPerShare = Number(equipment.power) / equipment.shareCount;
        const userPower = powerPerShare * share.balanceShareCount;

        // Добавляем к существующим значениям
        const currentHashrate = algorithmHashrate.get(algorithm.id) || 0;
        const currentPower = algorithmPower.get(algorithm.id) || 0;

        algorithmHashrate.set(algorithm.id, currentHashrate + userHashrate);
        algorithmPower.set(algorithm.id, currentPower + userPower);
      }

      // Для каждого алгоритма
      for (const [algorithmId, totalHashrate] of algorithmHashrate) {
        const algorithm = algorithms.find((a) => a.id === algorithmId);
        if (!algorithm || !algorithm.coinTickers) continue;

        const totalPower = algorithmPower.get(algorithmId) || 0;
        const electricityPrice = Number(electricityPrices.pricePerKWh) || 0;

        // Для каждой монеты в алгоритме
        for (const coinTicker of algorithm.coinTickers) {
          // Рассчитываем награду за час
          const dailyRewardPerHashrate = coinTicker.pricePerHashrate;
          const hourlyRewardPerHashrate = dailyRewardPerHashrate / 24;
          const minedAmount = totalHashrate * hourlyRewardPerHashrate;

          // Рассчитываем затраты на электричество
          const hourlyPowerConsumption = totalPower * 1; // 1 час
          const electricityCostUSD = hourlyPowerConsumption * electricityPrice;

          // Конвертируем стоимость электричества в монеты
          const currentCoinPrice = coinPrices[coinTicker.name] || 0;
          const electricityCostInCoin =
            currentCoinPrice > 0 ? electricityCostUSD / currentCoinPrice : 0;

          // Рассчитываем чистую награду
          const rewardAmount = minedAmount - electricityCostInCoin;

          // Получаем текущий баланс пользователя
          const lastReward = await db
            .select()
            .from(miningRewardsTable)
            .where(
              and(
                eq(miningRewardsTable.user_id, user.id),
                eq(miningRewardsTable.coinTicker, coinTicker.name),
              ),
            )
            .orderBy(desc(miningRewardsTable.id))
            .limit(1);

          const currentBalance = Number(lastReward[0]?.balanceAfter) || 0;
          const newBalance = currentBalance + rewardAmount;

          // Создаем запись о награде
          await db.insert(miningRewardsTable).values({
            user_id: user.id,
            coinTicker: coinTicker.name,
            minedAmount: minedAmount.toString(),
            electricityCost: electricityCostInCoin.toString(),
            rewardAmount: rewardAmount.toString(),
            balanceAfter: newBalance.toString(),
          });

          // Обновляем баланс пользователя
          await db.insert(balancesTable).values({
            user_id: user.id,
            coinTicker: coinTicker.name,
            coinAmount: newBalance.toString(),
            created_at: new Date(),
          });
        }
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error calculating mining rewards:', error);
    throw error;
  }
}

export async function runMiningRewardsCalculation() {
  try {
    console.log(
      `[${formatDateTime()}] 🔄 Starting mining rewards calculation...`,
    );

    const result = await calculateAndInsertMiningRewards();

    console.log(
      `[${formatDateTime()}] ✅ Mining rewards calculation completed successfully`,
    );
    return result;
  } catch (error) {
    console.error(
      `[${formatDateTime()}] ❌ Error during mining rewards calculation:`,
      error,
    );
    throw error;
  }
}
