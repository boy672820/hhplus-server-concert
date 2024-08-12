import { DatabaseModule } from '@libs/database';
import { KafkaModule } from '../lib/kafka';
import { MockApiModule } from '@libs/mock-api';
import { RedisModule } from '@libs/redlock';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { ScheduleModule } from '@nestjs/schedule';
import { validate } from './env.validator';
import { DomainExceptionFilter } from './domain-exception.filter';
import { LoggingInterceptor } from './logging.interceptor';
import { LoggingModule } from './logging.module';

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate,
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    RedisModule,
    LoggingModule,
    KafkaModule,
    MockApiModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: DomainExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
  exports: [RedisModule, CqrsModule, MockApiModule, KafkaModule],
})
export class CoreModule {}
