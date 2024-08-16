import { EventType, TransactionStatus } from '@libs/domain/types';
import { DomainError } from '@libs/common/errors';
import { Injectable } from '@nestjs/common';
import { OutboxAdapter } from '../adapters';
import { TransactionProducer } from '../producers';

@Injectable()
export class OutboxService {
  constructor(
    private readonly outboxAdapter: OutboxAdapter,
    private readonly transactionProducer: TransactionProducer,
  ) {}

  async progressTransaction(transactionId: string): Promise<void> {
    const transaction = await this.outboxAdapter.getTransactionByStatus(
      TransactionStatus.Pending,
      transactionId,
    );

    if (!transaction) {
      throw DomainError.notFound('트랜잭션을 찾을 수 없습니다.');
    }

    transaction.progress();

    await this.outboxAdapter.save(transaction);
  }

  async successTransaction(transactionId: string): Promise<void> {
    const transaction = await this.outboxAdapter.getTransactionByStatus(
      TransactionStatus.Progressing,
      transactionId,
    );

    if (!transaction) {
      throw DomainError.notFound('트랜잭션을 찾을 수 없습니다.');
    }

    transaction.success();

    await this.outboxAdapter.save(transaction);
  }

  async retryPendingMessages(): Promise<number> {
    const transactions = await this.outboxAdapter.getPendingTransactions();

    transactions.forEach((transaction) => transaction.autoRetry());

    return transactions.length;
  }

  emitTransaction(eventType: EventType, payload: Record<string, any>): void {
    this.transactionProducer.emitTransaction(eventType, payload);
  }
}
