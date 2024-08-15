import { GlobalConfigModule } from '@libs/config';
import { RedisConfigModule, RedisConfigService } from '@libs/config/redis';
import { LoggerModule } from '@libs/logger';
import { OutboxModule } from '@libs/outbox';
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { consumers } from './interface';
import { usecases } from './application';
import { adapters } from './infrastructure';
import { services } from './domain';
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
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: DomainExceptionFilter,
    },

    ...usecases,
    ...services,
    ...adapters,
  ],
  controllers: [...consumers],
})
export class ServiceOutboxModule {}
