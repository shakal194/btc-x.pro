import 'dotenv/config';
import db from '@/db/db';
import { usersTable } from '@/db/schema';
import { hashPassword } from '@/lib/utils';

async function seedUsers() {
  const password = '1234567!'; // Добавил спецсимвол для соответствия требованиям
  const hashedPassword = await hashPassword(password);

  try {
    console.log('Starting to seed users...');

    for (let i = 1; i <= 250; i++) {
      const email = `test${i.toString().padStart(3, '0')}@test.com`;
      const referral_code = Math.floor(100000 + Math.random() * 900000); // 6-значный код

      await db.insert(usersTable).values({
        email,
        password: hashedPassword,
        referral_code,
      });

      console.log(
        `Created user: ${email} with referral code: ${referral_code}`,
      );
    }

    console.log('Successfully seeded 250 users!');
  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    process.exit(0);
  }
}

seedUsers();
