import { Provider } from '@nestjs/common';
import { Redis } from 'ioredis';
import { REDIS_CLIENT } from './redis.token';
import { RedisModuleAsyncOptions, RedisModuleOptions } from './redis.interface';

const createRedis = (options: RedisModuleOptions): Redis =>
  new Redis({ host: options.host, port: options.port });

export const createRedisProvider = (options: RedisModuleOptions): Provider => ({
  provide: REDIS_CLIENT,
  useValue: createRedis(options),
});

export const createAsyncRedisProvider = (
  options: RedisModuleAsyncOptions,
): Provider => ({
  provide: REDIS_CLIENT,
  useFactory: (...args: any[]) => {
    const redisOptions = options.useFactory(...args);
    return createRedis(redisOptions);
  },
  inject: options.inject || [],
});
