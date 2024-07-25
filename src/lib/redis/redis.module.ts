import { RedisConfigModule } from '@config/redis';
import { Module, OnModuleDestroy } from '@nestjs/common';
import { redisProvider, redlockProvider } from './redis.provider';
import { InjectRedis } from '../decorators';
import { Redis } from 'ioredis';

@Module({
  imports: [RedisConfigModule],
  providers: [redisProvider, redlockProvider],
  exports: [redisProvider, redlockProvider],
})
export class RedisModule implements OnModuleDestroy {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async onModuleDestroy() {
    await this.redis.quit();
  }
}
