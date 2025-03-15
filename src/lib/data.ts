'use server';

import db from '@/db/db'; // Подключаем подключение к базе данных
import {
  electricityPriceTable,
  algorithmTable,
  equipmentsTable,
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
    const result = await db.insert(algorithmTable).values({
      name: algorithm,
      coinTickers: sql`CAST(${coinTickersJson} AS jsonb)`, // Using CAST to insert the JSON data into the jsonb column
    });

    console.log('Algorithm saved successfully', result);
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

    console.log(newPriceNumber);

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
    const result = await db.insert(equipmentsTable).values({
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

    console.log('Оборудование успешно добавлено', result);
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
