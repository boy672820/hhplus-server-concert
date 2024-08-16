import {
  EventType,
  LocalDateTime,
  TransactionStatus,
} from '@libs/domain/types';
import { InjectRedis } from '@libs/redis/decorators';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { Transaction } from './transaction.model';

@Injectable()
export class OutboxRepository {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async save(transaction: Transaction): Promise<void> {
    const separator = Math.random().toString(36).substring(7);

    await this.redis.set(
      this.key(transaction.status, transaction.id),
      `${transaction.type}${separator}${transaction.payload}${separator}${transaction.createdDate.toString()}${separator}${transaction.updatedDate.toString()}${separator}`,
    );
  }

  async remove(transaction: Transaction): Promise<void> {
    await this.redis.del(this.key(transaction.status, transaction.id));
  }

  async getTransactionByStatus(
    status: TransactionStatus,
    transactionId: string,
  ): Promise<Transaction | null> {
    const value = await this.redis.get(this.key(status, transactionId));

    if (!value) {
      return null;
    }

    const separator = value.substring(value.length - 6);
    const withoutSeparator = value.substring(0, value.length - 6);
    const [type, payload, createdDate, updatedDate] =
      withoutSeparator.split(separator);

    return Transaction.from({
      id: transactionId,
      type: type as EventType,
      payload,
      status: status,
      createdDate: LocalDateTime.parse(createdDate),
      updatedDate: LocalDateTime.parse(updatedDate),
    });
  }

  async getPendingTransactions(): Promise<Transaction[]> {
    const keys = await this.redis.keys(
      this.key(TransactionStatus.Pending, '*'),
    );

    if (keys.length === 0) {
      return [];
    }

    const values = await this.redis.mget(keys);
    const transactions = values.reduce<Transaction[]>((acc, value, index) => {
      if (!value) {
        return acc;
      }

      const [type, payload, createdDate, updatedDate] = value.split('@');
      const transaction = Transaction.from({
        id: keys[index].split(':')[2],
        type: type as EventType,
        payload,
        status: TransactionStatus.Pending,
        createdDate: LocalDateTime.parse(createdDate),
        updatedDate: LocalDateTime.parse(updatedDate),
      });

      acc.push(transaction);

      return acc;
    }, []);

    return transactions;
  }

  private key = (status: TransactionStatus, transactionId: string) =>
    `outbox-transactions:${status}:${transactionId}`;
}
