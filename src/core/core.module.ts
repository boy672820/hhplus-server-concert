import { DatabaseModule } from '@lib/database';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { validate } from './env.validator';
import { DomainExceptionFilter } from './domain-exception.filter';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate,
    }),
    DatabaseModule,
    ScheduleModule.forRoot(),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: DomainExceptionFilter,
    },
  ],
})
export class CoreModule {}
