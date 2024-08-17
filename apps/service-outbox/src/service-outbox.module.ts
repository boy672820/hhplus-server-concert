import { GlobalConfigModule } from '@libs/config';
import { KafkaConfigModule, KafkaConfigService } from '@libs/config/kafka';
import { RedisConfigModule, RedisConfigService } from '@libs/config/redis';
import { LoggerModule } from '@libs/logger';
import { OutboxModule } from '@libs/outbox';
import { KafkaClientModule } from '@libs/kafka-client';
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { CqrsModule } from '@nestjs/cqrs';
import { consumers, schedulers } from './interface';
import { events, usecases } from './application';
import { adapters, mappers, producers } from './infrastructure';
import { factories, services } from './domain';
import { DomainExceptionFilter } from './domain-exception.filter';

@Module({
  imports: [
    GlobalConfigModule,
    LoggerModule,
    OutboxModule.registerAsync({
      imports: [RedisConfigModule],
      useFactory: (redisConfigService: RedisConfigService) => ({
        redis: {
          host: redisConfigService.host,
          port: redisConfigService.port,
        },
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
    ScheduleModule.forRoot(),
    CqrsModule.forRoot(),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: DomainExceptionFilter,
    },
    ...schedulers,
    ...usecases,
    ...services,
    ...adapters,
    ...mappers,
    ...factories,
    ...events,
    ...producers,
  ],
  controllers: [...consumers],
})
export class ServiceOutboxModule {}
