import {
  integer,
  pgTable,
  varchar,
  timestamp,
  decimal,
  boolean,
  jsonb,
  uuid,
  text,
} from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  uuid: uuid().defaultRandom(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  registration_date: timestamp().notNull().defaultNow(),
  deleting_date: timestamp(),
  status: varchar({ enum: ['admin', 'user', 'delete'] })
    .notNull()
    .default('user'),
  referral_code: integer().notNull(),
  referrer_id: integer(),
  referral_percent: decimal({ precision: 30, scale: 8 }),
  referral_bonus: decimal({ precision: 10, scale: 2 }).default('0'),
});

export const algorithmTable = pgTable('algorithms', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  uuid: uuid().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  coinTickers: jsonb('coinTickers')
    .$type<{ name: string; pricePerHashrate: number }[]>()
    .default([]),
  hashrate_unit: varchar({ length: 10 }).notNull().default('Th'),
});

export const equipmentsTable = pgTable('equipments', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  uuid: uuid().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  algorithm_id: integer()
    .notNull()
    .references(() => algorithmTable.id),
  hashrate_unit: varchar({ length: 10 }).notNull(),
  hashrate: integer().notNull(),
  power: decimal({ precision: 10, scale: 4 }).notNull(),
  purchasePrice: integer().notNull(),
  salePrice: integer().notNull(),
  shareCount: integer().notNull(),
  photoUrl: varchar({ length: 255 }),
});

export const transactionsTable = pgTable('transactions', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  uuid: uuid().defaultRandom(), // ID сделки
  transactionDate: timestamp().notNull().defaultNow(), // Дата и время сделки
  user_id: integer()
    .notNull()
    .references(() => usersTable.id), // User ID
  equipment_id: integer()
    .notNull()
    .references(() => equipmentsTable.id), // ID оборудования
  shareCount: integer().notNull(), // Количество долей
  balanceShareCount: integer().notNull(), // Баланс купленных долей
  pricePerShare: decimal({ precision: 10, scale: 2 }).notNull(), // Цена за долю устройства
  isPurchase: boolean().notNull(), // Покупка или продажа (true - покупка, false - продажа)
});

export const miningIncomeTable = pgTable('mining_income', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  uuid: uuid().defaultRandom(), // ID записи
  algorithm_id: integer()
    .notNull()
    .references(() => algorithmTable.id), // Алгоритм (ссылка на ID алгоритма)
  coinsPerHashrate: decimal({ precision: 30, scale: 8 }).notNull(), // Количество монет в сутки на единицу хешрейта
});

export const electricityPriceTable = pgTable('electricity_price', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  uuid: uuid().defaultRandom(), // ID записи
  pricePerKWh: decimal({ precision: 30, scale: 8 }), // Цена электричества в $ за кВт
  recordDate: timestamp().notNull().defaultNow(), // Дата и время записи
  referral_percent_default: decimal({ precision: 30, scale: 8 }),
  access_token: text(), // Токен доступа к API
  refresh_token: text(), // Рефреш токен
  access_expired_at: timestamp(), // Время истечения токена доступа
  refresh_expired_at: timestamp(), // Время истечения рефреш токена
});

export const miningRewardsTable = pgTable('mining_rewards', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  uuid: uuid().defaultRandom(), // ID записи
  recordDate: timestamp().notNull().defaultNow(), // Дата и время начисления
  user_id: integer()
    .notNull()
    .references(() => usersTable.id), // ID пользователя, для которого начислены вознаграждения
  coinTicker: varchar({ length: 10 }).notNull(), // Тиккер монеты (например, BTC)
  minedAmount: decimal({ precision: 30, scale: 8 }).notNull(), // Намайненное количество монет
  electricityCost: decimal({ precision: 30, scale: 8 }).notNull(), // Оплата за электричество
  rewardAmount: decimal({ precision: 30, scale: 8 }).notNull(), // Начисленное вознаграждение
  balanceAfter: decimal({ precision: 30, scale: 8 }).notNull(), // Баланс после начисления
});

export const historyChangesTable = pgTable('history_changes', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  uuid: uuid().defaultRandom(), // ID записи
  changeDate: timestamp().notNull().defaultNow(), // Дата и время изменения
  fieldName: varchar({ length: 255 }).notNull(), // Название поля, которое изменялось
  oldValue: varchar({ length: 255 }).notNull(), // Начальное значение поля
  newValue: varchar({ length: 255 }).notNull(), // Новое значение поля
  user_id: integer()
    .notNull()
    .references(() => usersTable.id), // ID пользователя, который произвел изменение
});

export const balancesTable = pgTable('balances', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  uuid: uuid('uuid').defaultRandom(),
  user_id: integer('user_id').notNull(),
  coinTicker: varchar({ length: 10 }).notNull(), // Тиккер монеты (например, BTC)
  coinAmount: decimal({ precision: 30, scale: 8 }).notNull(), // Количество монет
});

export const usersAddressTable = pgTable('users_address', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  uuid: uuid().defaultRandom(), // ID записи
  user_id: integer()
    .notNull()
    .references(() => usersTable.id), // ID пользователя
  coinTicker: varchar({ length: 10 }).notNull(), // Тиккер монеты
  depositAddress: varchar({ length: 255 }).notNull(), // Адрес для депозита
  depositId: varchar({ length: 255 }).notNull(), // ID депозита
  created_at: timestamp().defaultNow().notNull(), // Дата создания
});

export const withdrawalsTable = pgTable('withdrawals', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  uuid: uuid().defaultRandom(), // ID запроса на снятие
  user_id: integer()
    .notNull()
    .references(() => usersTable.id), // ID пользователя, который запрашивает снятие
  coinTicker: varchar({ length: 10 }).notNull(), // Тиккер монеты
  network: varchar({ length: 50 }).notNull(), // Сеть для снятия средств (например, Bitcoin, Ethereum)
  address: varchar({ length: 255 }).notNull(), // Адрес для перевода средств
  amount: decimal({ precision: 30, scale: 8 }).notNull(), // Сумма для снятия
  fee: decimal({ precision: 30, scale: 8 }).notNull(), // Сумма комиссии
  status: varchar({ length: 255 }).notNull(), // Статус запроса (подтверждён, одобрен, выполнен, отменён)
  created_at: timestamp().notNull(), // Дата создания
  updated_at: timestamp().notNull(), // Дата обновления
});

export const depositsTable = pgTable('deposits', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  uuid: uuid().defaultRandom(), // ID депозита
  user_id: integer()
    .notNull()
    .references(() => usersTable.id), // ID пользователя, который делает депозит
  coinTicker: varchar({ length: 10 }).notNull(), // Тиккер монеты (например, BTC)
  amount: decimal({ precision: 30, scale: 8 }).notNull(), // Сумма депозита
  status: varchar({ length: 255 }).notNull(), // Статус депозита (зачислен)
  depositId: integer().notNull(), // ID депозита в Coinsbuy
  created_at: timestamp().notNull(), // Дата создания
  updated_at: timestamp().notNull(), // Дата обновления
});

export const transactionsRefBonusTable = pgTable('transactions_refBonus', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  recordDate: timestamp().notNull().defaultNow(), // Дата и время записи
  uuid: uuid().defaultRandom(), // ID
  user_id: integer().notNull(), // ID пользователя, которому зачисляется реф.бонус
  referral_id: integer().notNull(), // ID реферала, который покупает доли
  referral_percent: decimal({ precision: 30, scale: 8 }).notNull(), //Реф.бонус в %
  referral_bonus: decimal({ precision: 10, scale: 2 }).notNull(), // Сумма бонуса
});

export const otpCodesTable = pgTable('otp_codes', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar({ length: 255 }).notNull(),
  otpCode: varchar({ length: 5 }).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  expiredAt: timestamp().notNull(),
});
