import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

void (async () => {
  try {
    const hashed = await bcrypt.hash('1234', 10);
    await prisma.user.create({
      data: {
        email: 'test@test.com',
        hashedPassword: hashed,
        nickname: 'test user2',
        role: 'USER',
      },
    });
    console.log('✅ Test user created!');
  } catch (e) {
    console.error('❌ Error seeding user:', e);
  } finally {
    await prisma.$disconnect();
  }
})();
