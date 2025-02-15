// lib/mongodb.js
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);

export async function connectToDatabase() {
  // Подключаемся к базе данных, если соединение еще не установлено
  await client.connect();
  const db = client.db(process.env.MONGODB_DB);  // Используем переменную окружения для имени базы данных
  return db;
}
