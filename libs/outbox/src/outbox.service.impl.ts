import { EventType, TransactionStatus } from '@libs/domain/types';
import { Injectable } from '@nestjs/common';
import { OutboxService } from './outbox.service';
import { OutboxRepository } from './outbox.repository';
import { Transaction } from './transaction.model';

@Injectable()
export class OutboxServiceImpl implements OutboxService {
  constructor(private readonly outboxRepository: OutboxRepository) {}

  async publish(
    type: EventType,
    payload: Record<string, any>,
  ): Promise<Transaction> {
    const transaction = Transaction.create(type, payload);
    await this.outboxRepository.save(transaction);
    return transaction;
  }

  async getTransactionByStatus(
    status: TransactionStatus,
    transactionId: string,
  ): Promise<Transaction | null> {
    const transaction = await this.outboxRepository.getTransactionByStatus(
      status,
      transactionId,
    );
    return transaction;
  }

  async save(transaction: Transaction): Promise<void> {
    const existingTransaction = await this.getTransactionByStatus(
      transaction.getPrevStatus(),
      transaction.id,
    );

    if (existingTransaction) {
      await this.outboxRepository.remove(existingTransaction);
    }

    await this.outboxRepository.save(transaction);
  }

  async getPendingTransactions(): Promise<Transaction[]> {
    const transactions = await this.outboxRepository.getPendingTransactions();
    return transactions;
  }
}
