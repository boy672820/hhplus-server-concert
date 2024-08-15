import { GlobalConfigModule } from '@libs/config';
import { RedisConfigModule, RedisConfigService } from '@libs/config/redis';
import { OutboxModule } from '@libs/outbox';
import { Module } from '@nestjs/common';
import { consumers } from './interface';
import { usecases } from './application';
import { adapters } from './infrastructure';
import { services } from './domain';

@Module({
  imports: [
    GlobalConfigModule,
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
  providers: [...usecases, ...services, ...adapters],
  controllers: [...consumers],
})
export class ServiceOutboxModule {}
