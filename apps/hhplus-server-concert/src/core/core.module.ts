import { GlobalConfigModule } from '@libs/config';
import { AppConfigModule, AppConfigService } from '@libs/config/app';
import { RedisConfigModule, RedisConfigService } from '@libs/config/redis';
import { KafkaConfigModule, KafkaConfigService } from '@libs/config/kafka';
import {
  OpenSearchConfigModule,
  OpenSearchConfigService,
} from '@libs/config/opensearch';
import { DatabaseModule } from '@libs/database';
import { PrometheusModule } from '@libs/prometheus';
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
    MockApiModule,
    PrometheusModule.register(),
    LoggerModule.forRootAsync({
      global: true,
      imports: [OpenSearchConfigModule, AppConfigModule],
      useFactory: (
        opensearchConfig: OpenSearchConfigService,
        appConfig: AppConfigService,
      ) => ({
        opensearchUrl: opensearchConfig.url,
        appName: 'ConcertService',
        environment: appConfig.nodeEnv,
      }),
      inject: [OpenSearchConfigService, AppConfigService],
    }),
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
    CqrsModule,
    MockApiModule,
    RedisModule,
    KafkaClientModule,
    OutboxModule,
  ],
})
export class CoreModule {}
