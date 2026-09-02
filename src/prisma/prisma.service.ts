import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    // A database that is unreachable at boot must not stop the server from
    // listening — the host would report the whole app as down, and the
    // contact form can still deliver email without the database.
    try {
      await this.$connect();
      this.logger.log('Database connected');
    } catch (err: unknown) {
      this.logger.error(
        `Database connection failed at startup: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
