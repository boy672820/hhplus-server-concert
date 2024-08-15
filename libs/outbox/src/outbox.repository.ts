import { InjectRedis } from '@libs/redis/decorators';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { Transaction } from './transaction.model';

@Injectable()
export class OutboxRepository {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async save(transaction: Transaction): Promise<void> {
    await this.redis.set(
      `outbox-transactions:${transaction.id}`,
      transaction.status,
    );
  }
}
