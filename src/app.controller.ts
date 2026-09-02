import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /** Reports whether the process is up and whether the database answers. */
  @Get('health')
  async health() {
    let database = 'up';

    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch (err: unknown) {
      database = `down: ${err instanceof Error ? err.message : String(err)}`;
    }

    return { status: 'ok', database, timestamp: new Date().toISOString() };
  }
}
