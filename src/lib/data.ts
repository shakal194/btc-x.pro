'use server';

import db from '@/db/db'; // Подключаем подключение к базе данных
import {
  electricityPriceTable,
  algorithmTable,
  equipmentsTable,
  transactionsTable,
  usersTable,
} from '@/db/schema'; // Импортируем таблицу
import { sql, desc, asc } from 'drizzle-orm';
import fs from 'fs';

//Получаем последнюю цену электричества с таблицы electricity_price
export async function fetchElectricityPrice() {
  try {
    // Вставляем данные в таблицу
    const lastElectricityPrice = await db
      .select()
      .from(electricityPriceTable)
      .orderBy(desc(electricityPriceTable.id))
      .limit(1);

    return lastElectricityPrice[0];
  } catch (error) {
    console.error('Error saving price:', error);
    throw new Error('Error saving price');
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

    console.log('Price saved successfully');
  } catch (error) {
    console.error('Error saving price:', error);
    throw new Error('Error saving price');
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

export async function fetchLastBalanceShareCountUserByEquipmentId(
  user_id: number,
  equipment_id: number,
) {
  try {
    const result = await db
      .select({
        balanceShareCount: transactionsTable.balanceShareCount,
      })
      .from(transactionsTable)
      .where(
        sql`${transactionsTable.user_id} = ${user_id} and ${transactionsTable.equipment_id} = ${equipment_id} `,
      ) // Фильтруем по user_id и equipment_id
      .orderBy(desc(transactionsTable.transactionDate)) // Сортируем по дате транзакции (по убыванию)
      .limit(1); // Ограничиваем результат одним значением

    // Проверяем, есть ли записи, и если есть, возвращаем balanceShareCount, иначе 0
    return result.length > 0 ? result : 0;
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
      .select({
        referral_code: usersTable.referral_code,
      })
      .from(usersTable)
      .where(sql`${usersTable.id} = ${user_id}`) // Фильтруем по user_id
      .limit(1); // Ограничиваем результат одним значением

    // Проверяем, есть ли записи, и если есть, возвращаем referral_code, иначе 0
    if (result && result.length > 0) {
      return result[0].referral_code;
    } else {
      return 0; // Возвращаем 0, если не найдено
    }
  } catch (error) {
    console.error('Ошибка получения реферального кода', error);
    throw new Error('Ошибка получения реферального кода');
  }
}
