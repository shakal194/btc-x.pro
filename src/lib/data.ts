'use server';

import db from '@/db/db'; // Подключаем подключение к базе данных
import {
  electricityPriceTable,
  algorithmTable,
  equipmentsTable,
  transactionsTable,
  usersTable,
  balancesTable,
  transactionsRefBonusTable,
  usersAddressTable,
  depositsTable,
  withdrawalsTable,
  miningRewardsTable,
} from '@/db/schema'; // Импортируем таблицу
import { sql, desc, asc, eq, and, gte, gt } from 'drizzle-orm';
import fs from 'fs';
import { createDepositForCoin } from './balance';

export interface MiningStats {
  totalMined: number;
  mined24h: number;
  profit24h: number;
}

// ============= Функции для работы с алгоритмами =============

//Получаем список всех алгоритмов
export async function fetchAlgorithms() {
  try {
    const algorithms = await db
      .select()
      .from(algorithmTable)
      .orderBy(asc(algorithmTable));

    return algorithms;
  } catch (error) {
    console.error('Error fetch algorithms:', error);
    throw new Error('Error fetch algorithms');
  }
}

// Получение алгоритма по UUID
export async function fetchAlgorithmByUuid(uuid: string) {
  try {
    const algorithm = await db
      .select()
      .from(algorithmTable)
      .where(sql`${algorithmTable.uuid} = ${uuid}`)
      .limit(1);

    return algorithm[0];
  } catch (error) {
    console.error('Error fetching algorithm:', error);
    throw new Error('Error fetching algorithm');
  }
}

// Добавление нового алгоритма
export async function insertAlgorithm(
  algorithm: string,
  coinTickers: { name: string; pricePerHashrate: number }[],
) {
  try {
    if (!coinTickers || !Array.isArray(coinTickers)) {
      throw new Error('coinTickers must be an array of objects');
    }

    coinTickers.forEach((ticker) => {
      if (!ticker.name || typeof ticker.pricePerHashrate !== 'number') {
        throw new Error(
          'Each coin ticker must have a name and pricePerHashrate',
        );
      }
    });

    const coinTickersJson = JSON.stringify(coinTickers);

    await db.insert(algorithmTable).values({
      name: algorithm,
      coinTickers: sql`CAST(${coinTickersJson} AS jsonb)`,
    });

    console.log('Algorithm saved successfully');
  } catch (error) {
    console.error('Error saving algorithm:', error);
    throw new Error('Error saving algorithm');
  }
}

// Обновление названия алгоритма
export async function updateAlgorithmName(uuid: string, newName: string) {
  try {
    await db
      .update(algorithmTable)
      .set({ name: newName })
      .where(sql`${algorithmTable.uuid} = ${uuid}`);

    console.log('Algorithm name updated successfully');
  } catch (error) {
    console.error('Error updating algorithm name:', error);
    throw new Error('Error updating algorithm name');
  }
}

// Удаление алгоритма
export async function deleteAlgorithm(uuid: string) {
  try {
    await db
      .delete(algorithmTable)
      .where(sql`${algorithmTable.uuid} = ${uuid}`);

    console.log('Algorithm deleted successfully');
  } catch (error) {
    console.error('Error deleting algorithm:', error);
    throw new Error('Error deleting algorithm');
  }
}

// ============= Функции для работы с монетами алгоритма =============

// Добавление новой монеты к алгоритму
export async function addTickerToAlgorithm(
  uuid: string,
  tickerName: string,
  pricePerHashrate: number,
) {
  try {
    const algorithm = await fetchAlgorithmByUuid(uuid);
    if (!algorithm) {
      throw new Error('Algorithm not found');
    }

    const currentTickers = algorithm.coinTickers || [];
    const newTicker = { name: tickerName, pricePerHashrate };

    await db
      .update(algorithmTable)
      .set({
        coinTickers: sql`CAST(${JSON.stringify([...currentTickers, newTicker])} AS jsonb)`,
      })
      .where(sql`${algorithmTable.uuid} = ${uuid}`);

    console.log('Ticker added successfully');
  } catch (error) {
    console.error('Error adding ticker:', error);
    throw new Error('Error adding ticker');
  }
}

//Удаление тикера у алгоритма
export async function deleteTickerFromAlgorithm(
  uuid: string,
  tickerName: string,
) {
  try {
    if (!uuid || !tickerName) {
      throw new Error('Algorithm uuid and ticker name cannot be empty');
    }

    const existingAlgorithm = await fetchAlgorithmByUuid(uuid);
    if (!existingAlgorithm) {
      throw new Error('Algorithm not found');
    }

    const currentCoinTickers = existingAlgorithm.coinTickers;

    if (currentCoinTickers && Array.isArray(currentCoinTickers)) {
      if (currentCoinTickers.length === 1) {
        await deleteAlgorithm(uuid);
        console.log('Algorithm deleted successfully');
      } else {
        const updatedCoinTickers = currentCoinTickers.filter(
          (ticker: any) => ticker.name !== tickerName,
        );

        await db
          .update(algorithmTable)
          .set({
            coinTickers: sql`CAST(${JSON.stringify(updatedCoinTickers)} AS jsonb)`,
          })
          .where(sql`${algorithmTable.uuid} = ${uuid}`);

        console.log('Ticker removed successfully');
      }
    }
  } catch (error) {
    console.error('Error deleting ticker:', error);
    throw new Error('Error deleting ticker');
  }
}

//Обновление количества монет на единицу хешрейта
export async function updateTickerPricePerHashrate(
  uuid: string,
  tickerName: string,
  newPriceNumber: number,
) {
  try {
    if (!uuid || !tickerName || isNaN(newPriceNumber)) {
      throw new Error('Invalid input data');
    }

    const existingAlgorithm = await fetchAlgorithmByUuid(uuid);
    if (!existingAlgorithm) {
      throw new Error('Algorithm not found');
    }

    const currentCoinTickers = existingAlgorithm.coinTickers;

    if (currentCoinTickers && Array.isArray(currentCoinTickers)) {
      const tickerIndex = currentCoinTickers.findIndex(
        (ticker: any) => ticker.name === tickerName,
      );

      if (tickerIndex === -1) {
        throw new Error('Ticker not found');
      }

      currentCoinTickers[tickerIndex].pricePerHashrate = newPriceNumber;

      await db
        .update(algorithmTable)
        .set({
          coinTickers: sql`CAST(${JSON.stringify(currentCoinTickers)} AS jsonb)`,
        })
        .where(sql`${algorithmTable.uuid} = ${uuid}`);

      console.log('Ticker price updated successfully');
    }
  } catch (error) {
    console.error('Error updating ticker price per hashrate:', error);
    throw new Error('Error updating ticker price per hashrate');
  }
}

//Получаем последнюю цену электричества с таблицы electricity_price
export async function fetchElectricityPrice() {
  try {
    // Вставляем данные в таблицу
    const lastElectricityPrice = await db
      .select({
        pricePerKWh: electricityPriceTable.pricePerKWh,
        recordDate: electricityPriceTable.recordDate,
      })
      .from(electricityPriceTable)
      .where(sql`${electricityPriceTable.pricePerKWh} IS NOT NULL`)
      .orderBy(desc(electricityPriceTable.id))
      .limit(1);

    return lastElectricityPrice[0];
  } catch (error) {
    console.error('Ошибка получения цены электричества:', error);
    throw new Error('Ошибка получения цены электричества');
  }
}

// Функция для вставки цены электричества в таблицу electricity_price
export async function insertElectricityPrice(pricePerKWh: number) {
  const currentDate = new Date().toISOString();
  try {
    if (typeof pricePerKWh !== 'number' || isNaN(pricePerKWh)) {
      throw new Error('Invalid price format. It should be a number.');
    }
    // Вставляем данные в таблицу
    await db.insert(electricityPriceTable).values({
      pricePerKWh: sql<number>`${pricePerKWh}`, // Цена, переданная в функцию
      recordDate: sql`${currentDate}`,
      // UUID и ID генерируются автоматически
    });

    console.log('Цена электричества успешно сохранена');
  } catch (error) {
    console.error('Ошибка сохранения цены электричества:', error);
    throw new Error('Ошибка сохранения цены электричества');
  }
}

//Получаем последнюю цену электричества с таблицы electricity_price
export async function fetchRefBonusDefault() {
  try {
    // Вставляем данные в таблицу
    const lastRefBonusDefault = await db
      .select({
        referral_percent_default:
          electricityPriceTable.referral_percent_default,
        recordDate: electricityPriceTable.recordDate,
      })
      .from(electricityPriceTable)
      .where(sql`${electricityPriceTable.referral_percent_default} IS NOT NULL`)
      .orderBy(desc(electricityPriceTable.id))
      .limit(1);

    return lastRefBonusDefault[0];
  } catch (error) {
    console.error('Ошибка получения цены электричества:', error);
    throw new Error('Ошибка получения цены электричества');
  }
}

// Функция для вставки общего реф.бонуса в таблицу electricity_price
export async function insertRefBonusDefault(referral_percent_default: number) {
  const currentDate = new Date().toISOString();
  try {
    if (
      typeof referral_percent_default !== 'number' ||
      isNaN(referral_percent_default)
    ) {
      throw new Error('Invalid price format. It should be a number.');
    }
    // Вставляем данные в таблицу
    await db.insert(electricityPriceTable).values({
      referral_percent_default: sql<number>`${referral_percent_default}`, // Цена, переданная в функцию
      recordDate: sql`${currentDate}`,
      // UUID и ID генерируются автоматически
    });

    console.log('Реф.бонус успешно сохранен');
  } catch (error) {
    console.error('Ошибка сохранения реф.бонуса:', error);
    throw new Error('Ошибка сохранения реф.бонуса');
  }
}

//Добавление оборудования
export async function insertEquipment(equipmentData: {
  name: string;
  algorithm_id: number;
  hashrate_unit: string; // Указываем возможные значения для hashrate_unit
  hashrate: number;
  power: number;
  purchasePrice: number;
  salePrice: number;
  shareCount: number;
  photoUrl: string;
}) {
  try {
    // Подготовка данных для вставки в базу
    const {
      name,
      algorithm_id,
      hashrate_unit,
      hashrate,
      power,
      purchasePrice,
      salePrice,
      shareCount,
      photoUrl,
    } = equipmentData;

    const buffer = Buffer.from(photoUrl.split(',')[1], 'base64');
    const filePath = `public/equipments/${name}_${hashrate}_${power}.jpg`;

    fs.writeFileSync(filePath, buffer);

    // Вставка данных в таблицу
    await db.insert(equipmentsTable).values({
      name: sql`${name}`,
      algorithm_id: sql`${algorithm_id}`,
      hashrate_unit: sql`${hashrate_unit}`,
      hashrate: sql`${hashrate}`,
      power: sql`${power}`,
      purchasePrice: sql`${purchasePrice}`,
      salePrice: sql`${salePrice}`,
      shareCount: sql`${shareCount}`,
      photoUrl: sql`${filePath}`,
      // Тут можно добавить поле photoUrl, если оно потребуется
    });

    console.log('Оборудование успешно добавлено');
  } catch (error) {
    console.error('Ошибка при добавлении оборудования:', error);
    throw new Error('Ошибка при добавлении оборудования');
  }
}

//Получаем оборудование с таблицы equipments
export async function fetchEquipments() {
  try {
    // Вставляем данные в таблицу
    const equipments = await db
      .select()
      .from(equipmentsTable)
      .orderBy(asc(equipmentsTable));

    return equipments;
  } catch (error) {
    console.error('Error fetch equipments:', error);
    throw new Error('Error fetch equipments');
  }
}

//Получаем оборудование по ID с таблицы equipments
export async function fetchEquipmentByUuid(equipmentUuid: string) {
  try {
    // Получаем данные оборудования вместе с данными алгоритма
    const equipment = await db
      .select({
        id: equipmentsTable.id,
        uuid: equipmentsTable.uuid,
        name: equipmentsTable.name,
        algorithm_id: equipmentsTable.algorithm_id,
        hashrate_unit: equipmentsTable.hashrate_unit,
        hashrate: equipmentsTable.hashrate,
        power: equipmentsTable.power,
        purchasePrice: equipmentsTable.purchasePrice,
        salePrice: equipmentsTable.salePrice,
        shareCount: equipmentsTable.shareCount,
        photoUrl: equipmentsTable.photoUrl,
        algorithm: {
          id: algorithmTable.id,
          name: algorithmTable.name,
          coinTickers: algorithmTable.coinTickers,
        },
      })
      .from(equipmentsTable)
      .leftJoin(
        algorithmTable,
        eq(equipmentsTable.algorithm_id, algorithmTable.id),
      )
      .where(sql`${equipmentsTable.uuid} = ${equipmentUuid}`);

    return equipment;
  } catch (error) {
    console.error('Error fetch equipments:', error);
    throw new Error('Error fetch equipments');
  }
}

//Обновляем оборудование по ID
export async function updateEquipment(
  equipmentId: string,
  equipmentData: {
    name: string;
    purchasePrice: number;
    salePrice: number;
  },
) {
  try {
    // Подготовка данных для обновления
    const { name, purchasePrice, salePrice } = equipmentData;

    // Выполняем обновление в базе данных
    await db
      .update(equipmentsTable)
      .set({
        name: sql`${name}`,
        purchasePrice: sql`${purchasePrice}`,
        salePrice: sql`${salePrice}`,
      })
      .where(sql`${equipmentsTable.uuid} = ${equipmentId}`); // Обновляем устройство по ID

    console.log('Оборудование успешно обновлено');
  } catch (error) {
    console.error('Ошибка при обновлении оборудования:', error);
    throw new Error('Ошибка при обновлении оборудования');
  }
}

//Получаем оборудование купленное пользователем
export async function fetchTransactionsTable(user_id: string) {
  try {
    // Вставляем данные в таблицу
    const transactions = await db
      .select()
      .from(transactionsTable)
      .orderBy(desc(transactionsTable))
      .where(sql`${transactionsTable.user_id} = ${user_id}`);

    return transactions;
  } catch (error) {
    console.error('Ошибка получения транзакций', error);
    throw new Error('Ошибка получения транзакций');
  }
}

export async function fetchLastTransactionByEquipmentId(
  userId: number,
  equipmentId: number,
) {
  try {
    // Получаем последнюю транзакцию по конкретному устройству, где balanceShareCount > 0
    const result = await db
      .select()
      .from(transactionsTable)
      .where(
        sql`${transactionsTable.user_id} = ${userId} AND ${transactionsTable.equipment_id} = ${equipmentId} AND ${transactionsTable.balanceShareCount} > 0`,
      )
      .orderBy(desc(transactionsTable.transactionDate)) // Сортируем по дате транзакции (последнюю)
      .limit(1);

    if (result.length === 0) {
      return null; // Если транзакция не найдена
    }

    return result[0]; // Возвращаем последнюю транзакцию
  } catch (error) {
    console.error('Error fetching last transaction:', error);
    throw new Error('Ошибка при получении последней транзакции');
  }
}

// Функция для получения всех балансов пользователя за один запрос
export async function fetchAllUserBalanceShares(userId: number) {
  try {
    const result = await db
      .select({
        id: transactionsTable.id,
        balanceShareCount: transactionsTable.balanceShareCount,
        equipment_id: transactionsTable.equipment_id,
      })
      .from(transactionsTable)
      .where(sql`${transactionsTable.user_id} = ${userId}`)
      .orderBy(desc(transactionsTable.id));

    // Группируем результаты по equipment_id, оставляя только последнюю транзакцию
    const latestBalances = result.reduce(
      (acc, curr) => {
        if (!acc[curr.equipment_id] || acc[curr.equipment_id].id < curr.id) {
          acc[curr.equipment_id] = curr;
        }
        return acc;
      },
      {} as Record<number, (typeof result)[0]>,
    );

    return latestBalances;
  } catch (error) {
    console.error('Ошибка получения балансов долей', error);
    throw new Error('Ошибка получения балансов долей');
  }
}

//Получаем оборудование купленное пользователем
export async function insertTransactionsTable(transactionData: {
  user_id: number;
  equipment_id: number;
  countShareBuySell: number;
  balanceShareCount: number;
  pricePerShare: number;
  isPurchase: boolean;
}) {
  try {
    const {
      user_id,
      equipment_id,
      countShareBuySell,
      balanceShareCount,
      pricePerShare,
      isPurchase,
    } = transactionData;
    // Вставка данных в таблицу
    await db.insert(transactionsTable).values({
      user_id: sql`${user_id}`,
      equipment_id: sql`${equipment_id}`,
      shareCount: sql`${countShareBuySell}`,
      balanceShareCount: sql`${balanceShareCount}`,
      pricePerShare: sql`${pricePerShare}`,
      isPurchase: sql`${isPurchase}`,
    });
  } catch (error) {
    console.error('Ошибка вставки транзакций', error);
    throw new Error('Ошибка вставки транзакций');
  }
}

//Получаем Реферальный код
export async function fetchReferralCodeByUserId(user_id: number) {
  try {
    // Проверяем, является ли user_id числом
    if (isNaN(user_id) || user_id === null) {
      throw new Error('Invalid User. Try again later');
    }

    const result = await db
      .select()
      .from(usersTable)
      .where(sql`${usersTable.id} = ${user_id}`) // Фильтруем по user_id
      .limit(1); // Ограничиваем результат одним значением

    // Проверяем, есть ли записи, и если есть, возвращаем referral_code, иначе 0

    return result[0];
  } catch (error) {
    console.error('Ошибка получения реферального кода', error);
    throw new Error('Ошибка получения реферального кода');
  }
}

//Получаем айди реферрера по реф.коду
export async function fetchUserIdByReferralCode(referral_code: number) {
  try {
    if (isNaN(referral_code) || referral_code === null) {
      throw new Error('Invalid Ref Code. Try again later');
    }

    const result = await db
      .select()
      .from(usersTable)
      .where(sql`${usersTable.referral_code} = ${referral_code}`)
      .limit(1);

    // Если данных нет, выбрасываем ошибку
    if (result.length === 0) {
      console.error('Ref.Code not valid');
      //throw new Error('Ref.Code not valid');
    }

    // Если данные найдены, возвращаем их
    return result[0];
  } catch (error: unknown) {
    // Тип ошибки теперь "unknown"
    console.error('Catch Error', error);

    // Проверка, если ошибка имеет тип Error
    if (error instanceof Error) {
      // Если ошибка из-за невалидного кода
      if (error.message === 'Ref.Code not valid') {
        //return 'Error: Ref.Code not valid';
        throw new Error('Ref.Code not valid');
      }
      // Если ошибка с запросом или соединением с БД
      else {
        //return 'Ошибка получения user_id';
        throw new Error('Ошибка получения user_id');
      }
    } else {
      throw new Error('Неизвестная ошибка');
    }
  }
}

export async function fetchUSDTBalance(userId: number) {
  try {
    // Получаем все записи баланса USDT для пользователя
    const result = await db
      .select({
        coinAmount: balancesTable.coinAmount,
        coinTicker: balancesTable.coinTicker,
        uuid: balancesTable.uuid,
        id: balancesTable.id,
      })
      .from(balancesTable)
      .where(
        sql`${balancesTable.user_id} = ${userId} 
        AND ${balancesTable.coinTicker} = 'USDT'`,
      )
      .orderBy(desc(balancesTable.id));

    // Берем последнюю запись как текущий баланс
    const currentBalance = result[0]?.coinAmount ?? 0;

    return currentBalance;
  } catch (error) {
    console.error('[USDT Balance] Error fetching balance:', error);
    throw new Error('Ошибка при получении баланса USDT');
  }
}

export async function updateUSDTBalance(
  userId: number,
  amount: number,
  isPurchase: boolean,
) {
  try {
    console.log(
      `[USDT Transaction] Starting ${isPurchase ? 'purchase' : 'sale'} for user ${userId}`,
    );
    console.log(`[USDT Transaction] Amount: ${amount}`);

    // Получаем текущий баланс USDT
    const currentBalance = await fetchUSDTBalance(userId);
    console.log(`[USDT Transaction] Current balance: ${currentBalance}`);

    const newBalance = isPurchase
      ? Number(currentBalance) - Number(amount) // Уменьшаем баланс при покупке
      : Number(currentBalance) + Number(amount); // Увеличиваем баланс при продаже

    console.log(`[USDT Transaction] New balance will be: ${newBalance}`);

    if (isPurchase && newBalance < 0) {
      console.error(
        `[USDT Transaction] Insufficient funds. Required: ${amount}, Available: ${currentBalance}`,
      );
      throw new Error('Недостаточно USDT для покупки');
    }

    // Создаем новую запись в таблице balances
    await db.insert(balancesTable).values({
      user_id: sql`${userId}`,
      coinTicker: 'USDT',
      coinAmount: sql`${newBalance}`,
    });

    console.log(
      `[USDT Transaction] Balance updated successfully. New balance: ${newBalance}`,
    );
    return newBalance;
  } catch (error) {
    console.error('[USDT Transaction] Error updating balance:', error);
    throw new Error('Ошибка при обновлении баланса USDT');
  }
}

export async function fetchAllUserBalances(userId: number) {
  try {
    console.log(`[Balances] Fetching all balances for user ${userId}`);
    const result = await db
      .select({
        coinAmount: balancesTable.coinAmount,
        coinTicker: balancesTable.coinTicker,
        id: balancesTable.id,
      })
      .from(balancesTable)
      .where(sql`${balancesTable.user_id} = ${userId}`)
      .orderBy(desc(balancesTable.id));

    // Группируем балансы по тикеру, берем последний баланс для каждого тикера
    const latestBalances = result.reduce(
      (acc, curr) => {
        if (!acc[curr.coinTicker] || acc[curr.coinTicker].id < curr.id) {
          acc[curr.coinTicker] = curr;
        }
        return acc;
      },
      {} as Record<string, (typeof result)[0]>,
    );

    return Object.values(latestBalances);
  } catch (error) {
    console.error('[Balances] Error fetching balances:', error);
    throw new Error('Ошибка при получении балансов');
  }
}

//Получаем реф.бонус реферрера
export async function fetchReferralBonus(userId: number) {
  try {
    // Получаем реферера пользователя, если он есть
    const userResult = await db
      .select({ referrer_id: usersTable.referrer_id })
      .from(usersTable)
      .where(sql`${usersTable.id} = ${userId}`)
      .limit(1);

    if (!userResult || userResult.length === 0 || !userResult[0].referrer_id) {
      console.log(`[Referral Bonus] No referrer found for user ${userId}`);
      return { referralBonus: 0, referrerId: null }; // Возвращаем объект с дефолтными значениями
    }

    console.log(
      `[Referral Bonus] Fetching referral bonus for user ${userResult[0].referrer_id}`,
    );

    // Получаем реферальный бонус для реферера
    const referrer = await db
      .select({ referral_percent: usersTable.referral_percent })
      .from(usersTable)
      .where(sql`${usersTable.id} = ${userResult[0].referrer_id}`)
      .limit(1);

    console.log('[referrer] - ', referrer);

    // Проверяем, что реферер найден
    if (!referrer || referrer.length === 0) {
      console.log(`[Referral Bonus] No referral bonus found for referrer`);
      return { referralBonus: 0, referrerId: userResult[0].referrer_id }; // Если бонус не найден, возвращаем 0
    }

    // Получаем общий реферальный процент из таблицы electricity_price
    const electricityPrice = await db
      .select({
        referral_percent_default:
          electricityPriceTable.referral_percent_default,
      })
      .from(electricityPriceTable)
      .orderBy(desc(electricityPriceTable.id)) // Получаем последнюю запись
      .where(sql`${electricityPriceTable.referral_percent_default} IS NOT NULL`) // Получаем последнюю запись
      .limit(1);

    console.log('[electricityPrice] - ', electricityPrice);

    // Если у реферера есть индивидуальный бонус, используем его, иначе используем общий
    const referralBonusPercent = referrer[0]?.referral_percent
      ? referrer[0].referral_percent
      : electricityPrice[0]?.referral_percent_default || 0;

    console.log('[referralBonusPercent] - ', referralBonusPercent);

    console.log(
      `[Referral Bonus] Referral bonus for user ${userResult[0].referrer_id}: ${referralBonusPercent}%`,
    );

    // Возвращаем как бонус, так и реферер айди
    return {
      referralBonus: referralBonusPercent,
      referrerId: userResult[0].referrer_id,
    };
  } catch (error) {
    console.error('[Referral Bonus] Error fetching referral bonus:', error);
    throw new Error('Ошибка при получении реферального бонуса');
  }
}

// Обновляем реф. баланс пользователя
export async function updateReferralBonus(
  referrerId: number,
  referralBonusAmount: number,
) {
  try {
    console.log(`[Referral Bonus] Updating bonus for referrer ${referrerId}`);

    // Обновляем реферальный бонус для реферера, обрабатывая null значения
    await db
      .update(usersTable)
      .set({
        referral_bonus: sql`COALESCE(${usersTable.referral_bonus}, 0) + ${referralBonusAmount}`,
        referral_percent: sql`COALESCE(${usersTable.referral_percent}, ${sql.raw('(SELECT referral_percent_default FROM electricity_price ORDER BY id DESC LIMIT 1)')})`,
      })
      .where(sql`${usersTable.id} = ${referrerId}`);

    console.log(
      `[Referral Bonus] Referral bonus of $${referralBonusAmount.toFixed(2)} successfully updated for referrer ${referrerId}`,
    );
  } catch (error) {
    console.error('[Referral Bonus] Error updating referral bonus:', error);
    throw new Error('Ошибка при обновлении реферального бонуса');
  }
}

//Получаем реф. баланс пользователя
export async function fetchRefBalance(userId: number) {
  try {
    // Получаем все записи баланса USDT для пользователя
    const result = await db
      .select({
        referral_bonus: usersTable.referral_bonus,
      })
      .from(usersTable)
      .where(sql`${usersTable.id} = ${userId}`)
      .orderBy(desc(usersTable.id));

    // Берем последнюю запись как текущий баланс
    const currentBalance = result[0]?.referral_bonus ?? 0;

    return currentBalance;
  } catch (error) {
    console.error('[USDT Ref Balance] Error fetching ref.balance:', error);
    throw new Error('Ошибка при получении реф.баланса USDT');
  }
}

//Делаем вставку в таблицу transactionsRefBonusTable при покупке долей рефералом
export async function insertReferralBonusTransaction(
  userId: number,
  referralId: number,
  referralPercent: number,
  referralBonus: number,
) {
  try {
    // Convert to string with exactly 2 decimal places
    const bonusString = referralBonus.toFixed(2);

    console.log('Inserting referral bonus transaction:', {
      userId,
      referralId,
      referralPercent,
      referralBonus: bonusString, // Log the string value
    });

    await db.insert(transactionsRefBonusTable).values({
      user_id: sql`${userId}`,
      referral_id: sql`${referralId}`,
      referral_percent: sql`${Math.round(referralPercent)}`,
      referral_bonus: sql`${bonusString}::decimal(10,2)`, // Use string value and explicit cast
    });

    console.log('Successfully inserted referral bonus transaction');
  } catch (error) {
    console.error('Error inserting referral bonus transaction:', error);
    throw new Error('Ошибка при записи транзакции реферального бонуса');
  }
}

export async function fetchUserData() {
  try {
    // Получаем информацию о всех пользователях
    const userResult = await db
      .select()
      .from(usersTable)
      .orderBy(desc(usersTable.id));

    if (!userResult || userResult.length === 0) {
      throw new Error(`Users not found`);
    }

    return userResult; // возвращаем массив объектов пользователей
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw new Error('Ошибка при получении данных о пользователе');
  }
}

export async function fetchReferralCount(user_id: number) {
  try {
    // Получаем количество пользователей, у которых в поле referrer_id значится переданный user_id
    const userRefCount = await db
      .select()
      .from(usersTable)
      .where(sql`${usersTable.referrer_id} = ${user_id}`);

    // Возвращаем количество пользователей
    return userRefCount.length;
  } catch (error) {
    console.error('Error fetching referral count:', error);
    throw new Error('Ошибка при получении количества рефералов');
  }
}

export async function fetchUserDataByUuid(uuid: string) {
  try {
    const userDataByUuid = await db
      .select()
      .from(usersTable)
      .where(sql`${usersTable.uuid} = ${uuid}`);

    if (userDataByUuid.length === 0) {
      throw new Error('User not found');
    }

    return userDataByUuid[0];
  } catch (error) {
    console.error('Error fetching user data by UUID:', error);
    //throw new Error('Error fetching user data by UUID');
  }
}

export async function updateUserDataByUuid(
  uuid: string,
  data: {
    status: 'admin' | 'user' | 'delete';
    referralBonus: number;
    referralPercent: number;
  },
) {
  try {
    await db
      .update(usersTable)
      .set({
        status: data.status,
        referral_bonus: sql`${data.referralBonus}`,
        referral_percent: sql`${data.referralPercent}`,
        ...(data.status === 'delete' && {
          deleting_date: new Date(),
        }),
        ...(data.status !== 'delete' && {
          deleting_date: null,
        }),
      })
      .where(sql`${usersTable.uuid} = ${uuid}`);
  } catch (error) {
    console.error('Error updating user data:', error);
    throw new Error('Error updating user data');
  }
}

// Функции для работы с реферальными бонусами
export async function fetchUserRefBonusTransactions(referralId: number) {
  try {
    const result = await db
      .select({
        id: transactionsRefBonusTable.id,
        recordDate: transactionsRefBonusTable.recordDate,
        uuid: transactionsRefBonusTable.uuid,
        referral_id: transactionsRefBonusTable.referral_id,
        referral_percent: transactionsRefBonusTable.referral_percent,
        referral_bonus: transactionsRefBonusTable.referral_bonus,
        referralEmail: usersTable.email,
      })
      .from(transactionsRefBonusTable)
      .innerJoin(
        usersTable,
        eq(transactionsRefBonusTable.user_id, usersTable.id),
      )
      .where(eq(transactionsRefBonusTable.referral_id, referralId))
      .orderBy(desc(transactionsRefBonusTable.recordDate));

    return result;
  } catch (error) {
    console.error('Error fetching user referral bonus transactions:', error);
    return [];
  }
}

// Функция для получения истории покупок/продаж оборудования пользователя
export async function fetchUserEquipmentTransactions(userId: number) {
  try {
    const result = await db
      .select({
        id: transactionsTable.id,
        transactionDate: transactionsTable.transactionDate,
        uuid: transactionsTable.uuid,
        shareCount: transactionsTable.shareCount,
        balanceShareCount: transactionsTable.balanceShareCount,
        pricePerShare: transactionsTable.pricePerShare,
        isPurchase: transactionsTable.isPurchase,
        equipmentName: equipmentsTable.name,
        equipmentHashrate: equipmentsTable.hashrate,
        equipmentHashrateUnit: equipmentsTable.hashrate_unit,
      })
      .from(transactionsTable)
      .innerJoin(
        equipmentsTable,
        eq(transactionsTable.equipment_id, equipmentsTable.id),
      )
      .where(eq(transactionsTable.user_id, userId))
      .orderBy(desc(transactionsTable.transactionDate));

    return result;
  } catch (error) {
    console.error('Error fetching user equipment transactions:', error);
    return [];
  }
}

new Date().toISOString();

/**
 * Проверяет существование записи баланса для указанной монеты и создает ее с нулевым балансом, если запись отсутствует
 * @param {number} userId - ID пользователя
 * @param {string} coinTicker - Тикер монеты или массив тикеров
 * @returns {Promise<void>}
 */
export async function ensureBalanceRecordExists(
  userId: number,
  coinTicker: string | string[],
): Promise<void> {
  try {
    const tickers = Array.isArray(coinTicker) ? coinTicker : [coinTicker];

    for (const ticker of tickers) {
      // Проверяем существование записи
      const existingBalance = await db
        .select()
        .from(balancesTable)
        .where(
          and(
            eq(balancesTable.user_id, userId),
            eq(balancesTable.coinTicker, ticker),
          ),
        )
        .limit(1);

      // Если запись не существует, создаем новую с нулевым балансом
      if (!existingBalance.length) {
        await db.insert(balancesTable).values({
          user_id: userId,
          coinTicker: ticker,
          coinAmount: '0',
        });
        console.log(`Created balance record for ${ticker}`);
      }
    }
  } catch (error) {
    console.error('Error ensuring balance record exists:', error);
    throw new Error(
      `Failed to ensure balance record exists for user ${userId}: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    );
  }
}

// Вспомогательная функция для создания балансов при регистрации
export async function createInitialBalances(userId: number): Promise<void> {
  try {
    // Создаем записи для USDT и USDC
    await ensureBalanceRecordExists(userId, ['USDT', 'USDC']);
    console.log('Created initial balance records for new user');
  } catch (error) {
    console.error('Error creating initial balances:', error);
    throw new Error('Failed to create initial balances');
  }
}

/**
 * Проверяет наличие адреса депозита для пользователя и монеты, при необходимости создает новый
 */
export async function getOrCreateDepositAddress(
  userId: number,
  userEmail: string,
  coinTicker: string,
) {
  try {
    // Проверяем существование адреса
    const existingAddress = await db
      .select()
      .from(usersAddressTable)
      .where(
        and(
          eq(usersAddressTable.user_id, userId),
          eq(usersAddressTable.coinTicker, coinTicker),
        ),
      )
      .limit(1);

    // Если адрес уже существует, возвращаем его
    if (existingAddress.length > 0) {
      console.log(`Found existing deposit address for ${coinTicker}`);
      return {
        depositAddress: existingAddress[0].depositAddress,
        depositId: existingAddress[0].depositId,
      };
    }

    // Если адреса нет, создаем новый через API
    console.log(`Creating new deposit address for ${coinTicker}`);
    const result = await createDepositForCoin(userId, userEmail, coinTicker);
    console.log(`Created new deposit address for ${coinTicker}`);
    return result;
  } catch (error) {
    console.error('Error in getOrCreateDepositAddress:', error);
    throw new Error(
      `Failed to get/create deposit address for ${coinTicker}: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    );
  }
}

async function checkApiAvailability(apiUrl: string): Promise<boolean> {
  try {
    const response = await fetch(apiUrl + 'BTCUSDT');
    return response.ok;
  } catch (error) {
    return false;
  }
}

export async function fetchCoinPrice(coinName: string): Promise<number> {
  try {
    // Проверяем доступность обоих API
    const binanceApi = process.env.BINANCE_API_URL;
    const binanceUsApi = process.env.BINANCE_US_API_URL;

    if (!binanceApi || !binanceUsApi) {
      throw new Error('Binance API URLs are not configured');
    }

    // Проверяем доступность основного API
    const isMainApiAvailable = await checkApiAvailability(binanceApi);
    const apiUrl = isMainApiAvailable ? binanceApi : binanceUsApi;

    const response = await fetch(apiUrl + coinName + 'USDT');
    if (!response.ok) {
      throw new Error(`Failed to fetch price for ${coinName}`);
    }

    const data = await response.json();
    return parseFloat(data.price);
  } catch (error) {
    console.error(`Error fetching price for ${coinName}:`, error);
    return 0;
  }
}

// Функция для получения депозитов пользователя
export async function fetchUserDeposits(userId: number) {
  try {
    const result = await db
      .select({
        id: depositsTable.id,
        depositId: depositsTable.depositId,
        coinTicker: depositsTable.coinTicker,
        amount: depositsTable.amount,
        status: depositsTable.status,
        created_at: depositsTable.created_at,
        updated_at: depositsTable.updated_at,
      })
      .from(depositsTable)
      .where(eq(depositsTable.user_id, userId))
      .orderBy(desc(depositsTable.created_at));

    return result;
  } catch (error) {
    console.error('Error fetching user deposits:', error);
    return [];
  }
}

export async function createWithdrawal({
  userId,
  coinTicker,
  network,
  address,
  amount,
  fee,
}: {
  userId: number;
  coinTicker: string;
  network: string;
  address: string;
  amount: string;
  fee: string;
}) {
  try {
    const now = new Date();

    // Проверяем валидность значений и форматируем их
    const cleanAmount = amount?.toString().trim();
    const cleanFee = fee?.toString().trim();

    // Проверка на пустые значения
    if (!cleanAmount || !cleanFee) {
      throw new Error('Сумма вывода или комиссия не указаны');
    }

    // Проверка формата чисел (должны быть числа с не более чем 8 знаками после точки)
    const amountRegex = /^\d+(\.\d{1,8})?$/;
    const feeRegex = /^\d+(\.\d{1,8})?$/;

    if (!amountRegex.test(cleanAmount)) {
      throw new Error('Некорректный формат суммы вывода');
    }

    if (!feeRegex.test(cleanFee)) {
      throw new Error('Некорректный формат комиссии');
    }

    // Преобразуем значения в числа с фиксированной точностью
    const amountNum = parseFloat(parseFloat(cleanAmount).toFixed(8));
    const feeNum = parseFloat(parseFloat(cleanFee).toFixed(8));

    // Дополнительные проверки
    if (amountNum <= 0) {
      throw new Error('Сумма вывода должна быть больше 0');
    }

    if (feeNum < 0) {
      throw new Error('Комиссия не может быть отрицательной');
    }

    // Проверяем достаточность баланса
    const currentBalance = await fetchUserBalance(userId, coinTicker);
    const totalAmount = amountNum + feeNum;

    if (currentBalance < totalAmount) {
      throw new Error('Недостаточно средств для вывода с учетом комиссии');
    }

    // Проверяем, нет ли уже недавней записи с такими же параметрами
    const recentWithdrawal = await db
      .select()
      .from(withdrawalsTable)
      .where(
        and(
          eq(withdrawalsTable.user_id, userId),
          eq(withdrawalsTable.amount, amountNum.toString()),
          eq(withdrawalsTable.coinTicker, coinTicker),
          sql`${withdrawalsTable.created_at} > NOW() - INTERVAL '1 minute'`,
        ),
      )
      .limit(1);

    if (recentWithdrawal.length > 0) {
      throw new Error(
        'Дублирующий запрос на вывод. Пожалуйста, подождите минуту перед повторной попыткой.',
      );
    }

    // Создаем запись о выводе
    await db.insert(withdrawalsTable).values({
      user_id: userId,
      coinTicker,
      network,
      address: address.trim(),
      amount: amountNum.toString(),
      fee: feeNum.toString(),
      status: 'created',
      created_at: now,
      updated_at: now,
    });

    // Создаем новую запись баланса
    await db.insert(balancesTable).values({
      user_id: userId,
      coinTicker,
      coinAmount: (currentBalance - totalAmount).toString(),
    });
  } catch (error) {
    console.error('Error creating withdrawal:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Error creating withdrawal',
    );
  }
}

// Вспомогательная функция для получения баланса пользователя
async function fetchUserBalance(
  userId: number,
  coinTicker: string,
): Promise<number> {
  const balance = await db
    .select({ amount: balancesTable.coinAmount })
    .from(balancesTable)
    .where(
      and(
        eq(balancesTable.user_id, userId),
        eq(balancesTable.coinTicker, coinTicker),
      ),
    )
    .limit(1);

  if (!balance.length) {
    throw new Error('Balance not found');
  }

  return Number(balance[0].amount);
}

// Функция для получения всех выводов с информацией о пользователях
export async function fetchAllWithdrawals() {
  try {
    const withdrawals = await db
      .select({
        id: withdrawalsTable.id,
        uuid: withdrawalsTable.uuid,
        user_id: withdrawalsTable.user_id,
        userEmail: usersTable.email,
        coinTicker: withdrawalsTable.coinTicker,
        network: withdrawalsTable.network,
        address: withdrawalsTable.address,
        amount: withdrawalsTable.amount,
        fee: withdrawalsTable.fee,
        status: withdrawalsTable.status,
        created_at: withdrawalsTable.created_at,
        updated_at: withdrawalsTable.updated_at,
      })
      .from(withdrawalsTable)
      .innerJoin(usersTable, eq(withdrawalsTable.user_id, usersTable.id))
      .orderBy(desc(withdrawalsTable.id));

    return withdrawals;
  } catch (error) {
    console.error('Error fetching withdrawals:', error);
    throw new Error('Failed to fetch withdrawals');
  }
}

export async function confirmWithdrawal(id: number) {
  try {
    // Обновляем статус вывода на "confirmed"
    await db
      .update(withdrawalsTable)
      .set({
        status: 'confirmed',
        updated_at: new Date(),
      })
      .where(eq(withdrawalsTable.id, id));

    return { success: true };
  } catch (error) {
    console.error('Error confirming withdrawal:', error);
    return { success: false, error: 'Ошибка при подтверждении вывода' };
  }
}

export async function cancelWithdrawal(id: number) {
  try {
    // Получаем информацию о выводе
    const withdrawal = await db
      .select()
      .from(withdrawalsTable)
      .where(eq(withdrawalsTable.id, id))
      .limit(1);

    if (!withdrawal || withdrawal.length === 0) {
      throw new Error('Вывод не найден');
    }

    // Обновляем статус вывода на "canceled"
    await db
      .update(withdrawalsTable)
      .set({
        status: 'canceled',
        updated_at: new Date(),
      })
      .where(eq(withdrawalsTable.id, id));

    // Получаем последний баланс пользователя для данной монеты
    const currentBalance = await db
      .select()
      .from(balancesTable)
      .where(
        and(
          eq(balancesTable.user_id, withdrawal[0].user_id),
          eq(balancesTable.coinTicker, withdrawal[0].coinTicker),
        ),
      )
      .orderBy(desc(balancesTable.id))
      .limit(1);

    if (!currentBalance || currentBalance.length === 0) {
      throw new Error('Баланс пользователя не найден');
    }

    // Возвращаем средства на баланс пользователя (сумма вывода + комиссия)
    const totalAmount =
      Number(withdrawal[0].amount) + Number(withdrawal[0].fee);
    const newAmount = Number(currentBalance[0].coinAmount) + totalAmount;

    // Создаем новую запись баланса
    await db.insert(balancesTable).values({
      user_id: withdrawal[0].user_id,
      coinTicker: withdrawal[0].coinTicker,
      coinAmount: newAmount.toString(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error canceling withdrawal:', error);
    return { success: false, error: 'Ошибка при отмене вывода' };
  }
}

export async function fetchUserWithdrawals(userId: number) {
  try {
    const withdrawals = await db
      .select({
        id: withdrawalsTable.id,
        uuid: withdrawalsTable.uuid,
        user_id: withdrawalsTable.user_id,
        userEmail: usersTable.email,
        coinTicker: withdrawalsTable.coinTicker,
        network: withdrawalsTable.network,
        address: withdrawalsTable.address,
        amount: withdrawalsTable.amount,
        fee: withdrawalsTable.fee,
        status: withdrawalsTable.status,
        created_at: withdrawalsTable.created_at,
        updated_at: withdrawalsTable.updated_at,
      })
      .from(withdrawalsTable)
      .innerJoin(usersTable, eq(withdrawalsTable.user_id, usersTable.id))
      .where(eq(withdrawalsTable.user_id, userId))
      .orderBy(desc(withdrawalsTable.id));

    return withdrawals;
  } catch (error) {
    console.error('Error fetching user withdrawals:', error);
    throw new Error('Failed to fetch user withdrawals');
  }
}

// Функция для получения статистики майнинга по UUID оборудования
export async function fetchMiningStats(
  coinTicker: string,
  userId: number,
): Promise<MiningStats> {
  try {
    // Get all mined amounts for the coin
    const allRecords = await db
      .select({
        minedAmount: miningRewardsTable.minedAmount,
      })
      .from(miningRewardsTable)
      .where(
        and(
          eq(miningRewardsTable.coinTicker, coinTicker),
          eq(miningRewardsTable.user_id, userId),
        ),
      );

    const totalMined = allRecords.reduce(
      (sum, record) => sum + Number(record.minedAmount),
      0,
    );

    // Get records for last 24 hours
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const records = await db
      .select({
        minedAmount: miningRewardsTable.minedAmount,
        rewardAmount: miningRewardsTable.rewardAmount,
        recordDate: miningRewardsTable.recordDate,
      })
      .from(miningRewardsTable)
      .where(
        and(
          eq(miningRewardsTable.coinTicker, coinTicker),
          eq(miningRewardsTable.user_id, userId),
          gt(miningRewardsTable.recordDate, last24Hours),
        ),
      );

    console.log(
      `Found ${records.length} records for user ${userId} in last 24h`,
    );

    const mined24h = records.reduce(
      (sum, record) => sum + Number(record.minedAmount),
      0,
    );
    const profit24h = records.reduce(
      (sum, record) => sum + Number(record.rewardAmount),
      0,
    );

    return {
      totalMined,
      mined24h,
      profit24h,
    };
  } catch (error) {
    console.error('Error fetching mining stats:', error);
    return {
      totalMined: 0,
      mined24h: 0,
      profit24h: 0,
    };
  }
}

export async function fetchMiningRewardsHistory(
  userId: string | number,
): Promise<MiningRewardRecord[]> {
  try {
    // Получаем все записи майнинга для пользователя
    const records = await db
      .select({
        id: miningRewardsTable.id,
        recordDate: miningRewardsTable.recordDate,
        minedAmount: miningRewardsTable.minedAmount,
        electricityCost: miningRewardsTable.electricityCost,
        rewardAmount: miningRewardsTable.rewardAmount,
        balanceAfter: miningRewardsTable.balanceAfter,
        coinTicker: miningRewardsTable.coinTicker,
      })
      .from(miningRewardsTable)
      .where(eq(miningRewardsTable.user_id, Number(userId)))
      .orderBy(desc(miningRewardsTable.recordDate));

    // Получаем информацию об оборудовании пользователя
    const equipmentInfo = await db
      .select({
        equipment_id: transactionsTable.equipment_id,
        shareCount: transactionsTable.balanceShareCount,
        equipmentName: equipmentsTable.name,
        equipmentHashrate: equipmentsTable.hashrate,
        equipmentHashrateUnit: equipmentsTable.hashrate_unit,
        coinTickers: algorithmTable.coinTickers,
      })
      .from(transactionsTable)
      .innerJoin(
        equipmentsTable,
        eq(transactionsTable.equipment_id, equipmentsTable.id),
      )
      .innerJoin(
        algorithmTable,
        eq(equipmentsTable.algorithm_id, algorithmTable.id),
      )
      .where(eq(transactionsTable.user_id, Number(userId)))
      .orderBy(desc(transactionsTable.id));

    // Создаем мапу последних транзакций для каждого оборудования
    const latestEquipmentInfo = equipmentInfo.reduce<
      Record<string, (typeof equipmentInfo)[0]>
    >((acc, curr) => {
      const key = curr.equipment_id.toString();
      if (!acc[key] || acc[key].shareCount < curr.shareCount) {
        acc[key] = curr;
      }
      return acc;
    }, {});

    // Форматируем записи
    const formattedRecords = records.map((record) => {
      // Находим оборудование для данной монеты
      const equipment = Object.values(latestEquipmentInfo).find((eq) => {
        const tickers =
          typeof eq.coinTickers === 'string'
            ? JSON.parse(eq.coinTickers)
            : eq.coinTickers;
        return tickers.some(
          (t: { name: string }) => t.name === record.coinTicker,
        );
      });

      return {
        ...record,
        recordDate: record.recordDate.toISOString(),
        equipmentName: equipment?.equipmentName || 'Unknown',
        equipmentHashrate: (equipment?.equipmentHashrate || 0).toString(),
        equipmentHashrateUnit: equipment?.equipmentHashrateUnit || 'H/s',
        shareCount: equipment?.shareCount || 0,
      };
    });

    return formattedRecords;
  } catch (error) {
    console.error(
      '[Mining Rewards] Error fetching mining rewards history:',
      error,
    );
    return [];
  }
}

// Интерфейс для записи майнинга
export interface MiningRewardRecord {
  id: number;
  recordDate: string;
  minedAmount: string;
  electricityCost: string;
  rewardAmount: string;
  equipmentName: string;
  equipmentHashrate: string;
  equipmentHashrateUnit: string;
  shareCount: number;
  balanceAfter: string;
  coinTicker: string;
}

export async function getUserUuidById(userId: number) {
  try {
    const user = await db
      .select({
        uuid: usersTable.uuid,
      })
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    if (!user || user.length === 0) {
      throw new Error('User not found');
    }

    return user[0].uuid;
  } catch (error) {
    console.error('Error fetching user UUID:', error);
    throw error;
  }
}
