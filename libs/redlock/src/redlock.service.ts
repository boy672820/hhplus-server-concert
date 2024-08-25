import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import * as Redlock from 'redlock';
import { Redis } from 'ioredis';
import { Lock } from './lock.model';
import {
  PUBREDIS_PROVIDER,
  REDLOCK_PROVIDER,
  SUBREDIS_PROVIDER,
} from './redlock.provider';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class RedlockService implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject(REDLOCK_PROVIDER) private readonly redlock: Redlock,
    @Inject(SUBREDIS_PROVIDER) private readonly subRedis: Redis,
    @Inject(PUBREDIS_PROVIDER) private readonly pubRedis: Redis,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async onModuleInit() {
    const channel = Lock.channel;

    this.subRedis.subscribe(channel, (err) => {
      if (err) {
        this.subRedis.unsubscribe(channel);
      }
    });
  }

  async onModuleDestroy() {
    this.subRedis.removeAllListeners();
    this.subRedis.disconnect();
    this.pubRedis.disconnect();
  }

  async acquire(resources: string[], ttl = 10_000): Promise<Lock> {
    try {
      const lock = await this.redlock.acquire(['lock', ...resources], ttl, {
        retryCount: 0,
      });
      return Lock.create(lock, resources);
    } catch (e) {
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          clearTimeout(timeout);
          this.logger.error('[RedlockService] Acquire timeout', e);
          reject(e);
        }, 1000);

        this.subRedis.once('message', (_, message) => {
          if (message === Lock.toReleased(resources)) {
            resolve(this.acquire(resources, ttl));
          }
        });
      });
    }
  }

  async release(lock: Lock): Promise<void> {
    await lock.release();
    this.pubRedis.publish(Lock.channel, Lock.toReleased(lock.resources));
  }
}
