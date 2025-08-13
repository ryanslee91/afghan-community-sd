import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

beforeAll(async () => {
  console.log('🧹 Resetting & Seeding Test DB...');

  dotenv.config({
    path: path.resolve(__dirname, '../.env.test'),
    override: true,
  });
  console.log('>>> E2E DB URL in process.env:', process.env.DATABASE_URL);

  const envTestPath = path.resolve(__dirname, '../.env.test');
  function getEnvValue(key: string, filePath: string): string | undefined {
    const fileContent = readFileSync(filePath, 'utf-8');
    const line = fileContent.split('\n').find((l) => l.startsWith(`${key}=`));
    return line?.split('=')[1]?.replace(/"/g, '').trim();
  }

  const dbUrl = getEnvValue('DATABASE_URL', envTestPath);

  if (!dbUrl) {
    throw new Error('DATABASE_URL not found in .env.test');
  }

  // 테스트 DB 초기화
  execSync(
    `cross-env DATABASE_URL=${dbUrl} npx prisma migrate reset --force --skip-generate`,
    { stdio: 'inherit' },
  );

  // seed 실행
  execSync(`cross-env DATABASE_URL=${dbUrl} npx ts-node prisma/seed-test.ts`, {
    stdio: 'inherit',
  });

  await new Promise((r) => setTimeout(r, 100));
}, 30000);
