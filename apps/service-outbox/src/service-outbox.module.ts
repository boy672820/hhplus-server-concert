import { GlobalConfigModule } from '@libs/config';
import { RedisConfigModule, RedisConfigService } from '@libs/config/redis';
import { RedisModule } from '@libs/redis';
import { Module } from '@nestjs/common';
import { consumers } from './interface';
import { usecases } from './application';
import { repositories } from './infrastructure';
import { services } from './domain';

@Module({
  imports: [
    GlobalConfigModule,
    RedisModule.registerAsync({
      imports: [RedisConfigModule],
      useFactory: (redisConfig: RedisConfigService) => ({
        host: redisConfig.host,
        port: redisConfig.port,
      }),
      inject: [RedisConfigService],
    }),
  ],
  providers: [...usecases, ...services, ...repositories],
  controllers: [...consumers],
})
export class ServiceOutboxModule {}
