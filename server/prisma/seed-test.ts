import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);
  await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      hashedPassword,
      nickname: 'tester',
      role: 'USER',
      languages: ['ENGLISH'],
    },
  });
  console.log('✅ Test user seeded');
}

(async () => {
  try {
    await main();
  } catch (e) {
    console.error(e);
    // 즉시 프로세스를 죽이지 않고 종료 코드만 설정 (비동기 정리 시간 확보)
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
})();
