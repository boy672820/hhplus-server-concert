import { DynamicModule, Module } from '@nestjs/common';
import { RedisModuleAsyncOptions, RedisModuleOptions } from './redis.interface';
import {
  createAsyncRedisProvider,
  createRedisProvider,
} from './redis.provider';
import { REDIS_CLIENT } from './redis.token';

@Module({})
export class RedisModule {
  static register(options: RedisModuleOptions): DynamicModule {
    return {
      module: RedisModule,
      providers: [createRedisProvider(options)],
      exports: [REDIS_CLIENT],
    };
  }

  static registerAsync(options: RedisModuleAsyncOptions): DynamicModule {
    return {
      module: RedisModule,
      imports: options.imports || [],
      providers: [createAsyncRedisProvider(options)],
      exports: [REDIS_CLIENT],
    };
  }
}
