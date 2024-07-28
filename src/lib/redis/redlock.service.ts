import { Inject, Injectable } from '@nestjs/common';
import Redlock from 'redlock';
import { Redis } from 'ioredis';
import { InjectRedlock } from '../decorators';
import { Lock } from './lock.model';
import { PUBREDIS_PROVIDER, SUBREDIS_PROVIDER } from './redis.provider';

@Injectable()
export class RedlockService {
  constructor(
    @InjectRedlock() private readonly redlock: Redlock,
    @Inject(SUBREDIS_PROVIDER) private readonly subRedis: Redis,
    @Inject(PUBREDIS_PROVIDER) private readonly pubRedis: Redis,
  ) {}

  async acquire(resources: string[], ttl = 10_000): Promise<Lock> {
    const channel = Lock.channel(resources);
    try {
      const lock = await this.redlock.acquire(['lock', ...resources], ttl, {
        retryCount: 0,
      });
      this.pubRedis.publish(channel, 'acquired');
      return Lock.create(lock, resources);
    } catch (e) {
      return new Promise((resolve, reject) => {
        this.subRedis.subscribe(channel, (err) => {
          if (err) {
            this.subRedis.unsubscribe(channel);
            reject(err);
          }
        });
        this.subRedis.once('message', (_, message) => {
          if (message === 'released') {
            this.subRedis.unsubscribe(channel);
            resolve(this.acquire(resources, ttl));
          }
        });
      });
    }
  }

  async release(lock: Lock): Promise<void> {
    await lock.release();
    this.pubRedis.publish(lock.getChannel(), 'released');
  }
}
