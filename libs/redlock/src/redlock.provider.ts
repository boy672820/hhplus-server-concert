import { RedisConfigService } from '@libs/config/redis';
import { Provider } from '@nestjs/common';
import { Redis } from 'ioredis';
import * as Redlock from 'redlock';

export const REDIS_PROVIDER = Symbol('REDIS_PROVIDER');
export const SUBREDIS_PROVIDER = Symbol('SUBREDIS_PROVIDER');
export const PUBREDIS_PROVIDER = Symbol('PUBREDIS_PROVIDER');
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

export const subRedisProvider: Provider = {
  provide: SUBREDIS_PROVIDER,
  useFactory: (redisConfig: RedisConfigService): Redis => {
    const redis = new Redis({
      port: redisConfig.port,
      host: redisConfig.host,
    });
    redis.setMaxListeners(10_000);
    return redis;
  },
  inject: [RedisConfigService],
};

export const pubRedisProvider: Provider = {
  provide: PUBREDIS_PROVIDER,
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
