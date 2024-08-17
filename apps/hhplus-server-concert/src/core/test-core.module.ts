import { GlobalConfigModule } from '@libs/config';
import { RedisConfigModule, RedisConfigService } from '@libs/config/redis';
import { KafkaConfigModule, KafkaConfigService } from '@libs/config/kafka';
import { LoggerModule } from '@libs/logger';
import { OutboxModule } from '@libs/outbox';
import { MockApiModule } from '@libs/mock-api';
import { RedisModule } from '@libs/redis';
import { TestDatabaseModule } from '@libs/database';
import { RedlockModule } from '@libs/redlock';
import { KafkaClientModule } from '@libs/kafka-client';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DomainExceptionFilter } from './domain-exception.filter';
import { LoggingInterceptor } from './logging.interceptor';

@Module({
  imports: [
    GlobalConfigModule,
    CqrsModule,
    TestDatabaseModule,
    RedlockModule,
    LoggerModule,
    MockApiModule,
    RedisModule.registerAsync({
      imports: [RedisConfigModule],
      useFactory: (redisConfig: RedisConfigService) => ({
        host: redisConfig.host,
        port: redisConfig.port,
      }),
      inject: [RedisConfigService],
    }),
    KafkaClientModule.registerAsync({
      imports: [KafkaConfigModule],
      useFactory: (kafkaConfig: KafkaConfigService) => ({
        brokers: [`${kafkaConfig.host}:${kafkaConfig.port}`],
      }),
      inject: [KafkaConfigService],
    }),
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
  exports: [
    RedlockModule,
    RedisModule,
    CqrsModule,
    MockApiModule,
    OutboxModule,
  ],
})
export class TestCoreModule {}
