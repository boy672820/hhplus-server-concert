import { GlobalConfigModule } from '@libs/config';
import { RedisConfigModule, RedisConfigService } from '@libs/config/redis';
import { KafkaConfigModule, KafkaConfigService } from '@libs/config/kafka';
import {
  OpenSearchConfigModule,
  OpenSearchConfigService,
} from '@libs/config/opensearch';
import { DatabaseModule } from '@libs/database';
import { OpenSearchModule } from '@libs/opensearch';
import { LoggerModule } from '@libs/logger';
import { OutboxModule } from '@libs/outbox';
import { RedisModule } from '@libs/redis';
import { MockApiModule } from '@libs/mock-api';
import { RedlockModule } from '@libs/redlock';
import { KafkaClientModule } from '@libs/kafka-client';
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
    OpenSearchModule.reigsterAsync({
      imports: [OpenSearchConfigModule],
      useFactory: (opensearchConfig: OpenSearchConfigService) => ({
        url: opensearchConfig.url,
      }),
      inject: [OpenSearchConfigService],
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
    CqrsModule,
    MockApiModule,
    RedisModule,
    KafkaClientModule,
    OutboxModule,
  ],
})
export class CoreModule {}
