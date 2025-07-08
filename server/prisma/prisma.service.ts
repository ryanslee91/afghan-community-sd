import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  // connecting to db
  async onModuleInit() {
    await this.$connect();
  }
  // disconnecting from db
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
