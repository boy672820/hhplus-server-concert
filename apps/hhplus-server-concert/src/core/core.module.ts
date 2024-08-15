import { GlobalConfigModule } from '@libs/config';
import { RedisConfigModule, RedisConfigService } from '@libs/config/redis';
import { DatabaseModule } from '@libs/database';
import { LoggerModule } from '@libs/logger';
import { OutboxModule } from '@libs/outbox';
import { KafkaModule } from '../lib/kafka';
import { MockApiModule } from '@libs/mock-api';
import { RedisModule } from '@libs/redlock';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ScheduleModule } from '@nestjs/schedule';
import { DomainExceptionFilter } from './domain-exception.filter';
import { LoggingInterceptor } from './logging.interceptor';

@Module({
  imports: [
    GlobalConfigModule,
    CqrsModule,
    ScheduleModule.forRoot(),
    DatabaseModule,
    RedisModule,
    LoggerModule,
    KafkaModule,
    MockApiModule,
    OutboxModule.registerAsync({
      imports: [RedisConfigModule],
      useFactory: (redisConfig: RedisConfigService) => ({
        redis: {
          host: redisConfig.host,
          port: redisConfig.port,
        },
      }),
      inject: [RedisConfigService],
    }),
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
  exports: [RedisModule, CqrsModule, MockApiModule, KafkaModule, OutboxModule],
})
export class CoreModule {}
