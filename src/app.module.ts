import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { ServicesModule } from './modules/services/services.module';
import { StatsModule } from './modules/stats/stats.module';
import { ProcessesModule } from './modules/processes/processes.module';
import { TestimonialsModule } from './modules/testimonials/testimonials.module';
import { TechStackModule } from './modules/tech-stack/tech-stack.module';
import { ContactModule } from './modules/contact/contact.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    ServicesModule,
    StatsModule,
    ProcessesModule,
    TestimonialsModule,
    TechStackModule,
    ContactModule,
  ],
})
export class AppModule {}
