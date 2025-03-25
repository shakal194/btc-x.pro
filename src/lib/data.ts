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
} from '@/db/schema'; // Импортируем таблицу
import { sql, desc, asc } from 'drizzle-orm';
import fs from 'fs';

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

    console.log('lastElectricityPrice[0]', lastElectricityPrice[0]);

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

    console.log('lastRefBonusDefault[0]', lastRefBonusDefault[0]);
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

//Получаем алгоритмы с таблицы algorithms
export async function fetchAlgorithms() {
  try {
    // Вставляем данные в таблицу
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

// Добавление нового алгоритма
export async function insertAlgorithm(
  algorithm: string,
  coinTickers: { name: string; pricePerHashrate: number }[],
) {
  try {
    // Make sure coinTickers is an array of objects with the right structure
    if (!coinTickers || !Array.isArray(coinTickers)) {
      throw new Error('coinTickers must be an array of objects');
    }

    // Ensure that coinTickers array contains the correct properties (name, pricePerHashrate)
    coinTickers.forEach((ticker) => {
      if (!ticker.name || typeof ticker.pricePerHashrate !== 'number') {
        throw new Error(
          'Each coin ticker must have a name and pricePerHashrate',
        );
      }
    });

    // Prepare the coinTickers data as a JSON object for insertion
    const coinTickersJson = JSON.stringify(coinTickers);

    // Inserting the data into the database
    await db.insert(algorithmTable).values({
      name: algorithm,
      coinTickers: sql`CAST(${coinTickersJson} AS jsonb)`, // Using CAST to insert the JSON data into the jsonb column
    });

    console.log('Algorithm saved successfully');
  } catch (error) {
    console.error('Error saving algorithm:', error);
    throw new Error('Error saving algorithm');
  }
}

//Удаление тикера у алгоритма. Если тикер один, удаляется весь алгоритм
export async function deleteTickerFromAlgorithm(
  algorithmName: string,
  tickerName: string,
) {
  try {
    if (!algorithmName || !tickerName) {
      throw new Error('Algorithm name and ticker name cannot be empty');
    }

    // Fetch the current algorithm from the database
    const existingAlgorithm = await db
      .select()
      .from(algorithmTable)
      .where(sql`${algorithmTable.name} = ${algorithmName}`)
      .limit(1);

    if (existingAlgorithm.length === 0) {
      throw new Error('Algorithm not found');
    }

    const currentCoinTickers = existingAlgorithm[0].coinTickers;

    // If currentCoinTickers is valid
    if (currentCoinTickers && Array.isArray(currentCoinTickers)) {
      // Case 1: If there's only 1 ticker, delete the entire algorithm
      if (currentCoinTickers.length === 1) {
        await db
          .delete(algorithmTable)
          .where(sql`${algorithmTable.name} = ${algorithmName}`);

        console.log('Algorithm deleted successfully');
      } else {
        // Case 2: If there are more than 1 coinTickers, remove the specified one
        const updatedCoinTickers = currentCoinTickers.filter(
          (ticker: any) => ticker.name !== tickerName,
        );

        // Update the database with the modified coinTickers array
        await db
          .update(algorithmTable)
          .set({
            coinTickers: sql`CAST(${JSON.stringify(updatedCoinTickers)} AS jsonb)`,
          })
          .where(sql`${algorithmTable.name} = ${algorithmName}`);

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
  algorithmName: string,
  tickerName: string,
  newPriceNumber: number,
) {
  try {
    if (!algorithmName || !tickerName || isNaN(newPriceNumber)) {
      throw new Error('Invalid input data');
    }

    // Fetch the current algorithm from the database
    const existingAlgorithm = await db
      .select()
      .from(algorithmTable)
      .where(sql`${algorithmTable.name} = ${algorithmName}`)
      .limit(1);

    if (existingAlgorithm.length === 0) {
      throw new Error('Algorithm not found');
    }

    const currentCoinTickers = existingAlgorithm[0].coinTickers;

    // If currentCoinTickers is valid
    if (currentCoinTickers && Array.isArray(currentCoinTickers)) {
      // Find the ticker we need to update
      const tickerIndex = currentCoinTickers.findIndex(
        (ticker: any) => ticker.name === tickerName,
      );

      if (tickerIndex === -1) {
        throw new Error('Ticker not found');
      }

      // Update the pricePerHashrate for the found ticker
      currentCoinTickers[tickerIndex].pricePerHashrate = newPriceNumber;

      // Update the database with the modified coinTickers array
      await db
        .update(algorithmTable)
        .set({
          coinTickers: sql`CAST(${JSON.stringify(currentCoinTickers)} AS jsonb)`,
        })
        .where(sql`${algorithmTable.name} = ${algorithmName}`);

      console.log('Ticker price updated successfully');
    }
  } catch (error) {
    console.error('Error updating ticker price per hashrate:', error);
    throw new Error('Error updating ticker price per hashrate');
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
export async function fetchEquipmentById(equipmentUuid: string) {
  try {
    // Вставляем данные в таблицу
    const equipment = await db
      .select()
      .from(equipmentsTable)
      .orderBy(asc(equipmentsTable))
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

export async function fetchLastBalanceShareCountUserByEquipmentId(
  user_id: number,
  equipment_id: number,
) {
  try {
    console.log(
      `[DB Query] Fetching balance for user ${user_id}, equipment ${equipment_id}`,
    );
    const result = await db
      .select({
        balanceShareCount: transactionsTable.balanceShareCount,
        equipment_id: transactionsTable.equipment_id,
      })
      .from(transactionsTable)
      .where(
        sql`${transactionsTable.user_id} = ${user_id} 
        AND ${transactionsTable.equipment_id} = ${equipment_id}`,
      )
      .orderBy(desc(transactionsTable.id))
      .limit(1);

    const balance = result.length > 0 ? result[0].balanceShareCount : null;
    console.log(
      `[DB Result] Balance for equipment ${equipment_id}: ${balance}`,
    );
    return balance;
  } catch (error) {
    console.error('Ошибка получения баланса долей', error);
    throw new Error('Ошибка получения баланса долей');
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
    console.log(`[USDT Balance] Fetching balance for user ${userId}`);

    // Получаем все записи баланса USDT для пользователя
    const result = await db
      .select({
        coinAmount: balancesTable.coinAmount,
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
    console.log(
      `[USDT Balance] Current balance for user ${userId}: ${currentBalance}`,
    );
    console.log(`[USDT Balance] All balance records:`, result);

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

    console.log(`[Balances] Latest balances:`, latestBalances);
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

    // Обновляем реферальный бонус для реферера
    await db
      .update(usersTable)
      .set({
        referral_bonus: sql`${usersTable.referral_bonus} + ${referralBonusAmount}`,
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
    console.log(`[USDT Ref Balance] Fetching ref.balance for user ${userId}`);

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
    console.log(
      `[USDT Ref Balance] Current ref.balance for user ${userId}: ${currentBalance}`,
    );
    console.log(`[USDT Ref Balance] All ref.balance records:`, result);

    return currentBalance;
  } catch (error) {
    console.error('[USDT Ref Balance] Error fetching ref.balance:', error);
    throw new Error('Ошибка при получении реф.баланса USDT');
  }
}

//Делаем вставку в таблицу transactionsRefBonusTable при покупке долей рефералом
export async function insertReferralBonusTransaction({
  userId,
  referralId,
  referralPercent,
  referralBonus,
}: {
  userId: number;
  referralId: number;
  referralPercent: number;
  referralBonus: number;
}) {
  try {
    console.log(
      `[Referral Bonus] Inserting referral bonus transaction for user ${userId}`,
    );

    await db.insert(transactionsRefBonusTable).values({
      user_id: userId,
      referral_id: referralId,
      referral_percent: referralPercent,
      referral_bonus: referralBonus,
    });

    console.log(
      `[Referral Bonus] Referral bonus transaction successfully inserted for user ${userId}, ref.percent - ${referralPercent}, ref.bonus - ${referralBonus}`,
    );
  } catch (error) {
    console.error(
      '[Referral Bonus] Error inserting referral bonus transaction:',
      error,
    );
    throw new Error('Ошибка при записи транзакции реферального бонуса');
  }
}

export async function fetchUserData() {
  try {
    // Получаем информацию о всех пользователях
    const userResult = await db.select().from(usersTable);

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
