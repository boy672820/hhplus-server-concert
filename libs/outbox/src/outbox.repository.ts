import { TransactionStatus } from '@libs/domain/types';
import { InjectRedis } from '@libs/redis/decorators';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { Transaction } from './transaction.model';

@Injectable()
export class OutboxRepository {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async save(transaction: Transaction): Promise<void> {
    await this.redis.set(this.key(transaction.id), transaction.status);
  }

  async getStatus(transactionId: string): Promise<TransactionStatus | null> {
    const status = await this.redis.get(this.key(transactionId));
    return status as TransactionStatus;
  }

  private key = (transactionId: string) =>
    `outbox-transactions:${transactionId}`;
}
