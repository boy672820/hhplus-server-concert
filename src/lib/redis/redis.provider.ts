import { RedisConfigService } from '@config/redis';
import { Provider } from '@nestjs/common';
import { Redis } from 'ioredis';
import Redlock from 'redlock';

export const REDIS_PROVIDER = Symbol('REDIS_PROVIDER');
export const REDLOCK_PROVIDER = Symbol('REDLOCK_PROVIDER');

export const redisProvider: Provider = {
  provide: REDIS_PROVIDER,
  useFactory: (redisConfig: RedisConfigService): Redis =>
    new Redis({
      port: redisConfig.port,
      host: redisConfig.host,
    }),
  inject: [RedisConfigService],
};

export const redlockProvider: Provider = {
  provide: REDLOCK_PROVIDER,
  useFactory: (...clients: Redis[]): Redlock => new Redlock(clients),
  inject: [REDIS_PROVIDER],
};
