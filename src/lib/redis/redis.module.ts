import { RedisConfigModule } from '@config/redis';
import { Inject, Module, OnModuleDestroy } from '@nestjs/common';
import {
  PUBREDIS_PROVIDER,
  pubRedisProvider,
  redisProvider,
  redlockProvider,
  SUBREDIS_PROVIDER,
  subRedisProvider,
} from './redis.provider';
import { InjectRedis } from '../decorators';
import { Redis } from 'ioredis';
import { RedlockService } from './redlock.service';

@Module({
  imports: [RedisConfigModule],
  providers: [
    redisProvider,
    subRedisProvider,
    pubRedisProvider,
    redlockProvider,
    RedlockService,
  ],
  exports: [redisProvider, redlockProvider, RedlockService],
})
export class RedisModule implements OnModuleDestroy {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    @Inject(PUBREDIS_PROVIDER) private readonly pubRedis: Redis,
    @Inject(SUBREDIS_PROVIDER) private readonly subRedis: Redis,
  ) {}

  async onModuleDestroy() {
    await Promise.all([
      this.redis.quit(),
      this.pubRedis.quit(),
      this.subRedis.quit(),
    ]);
  }
}
