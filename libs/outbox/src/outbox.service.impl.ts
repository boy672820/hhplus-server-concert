import { Injectable } from '@nestjs/common';
import { LocalDateTime } from '../../domain/src/types';
import { OutboxService } from './outbox.service';
import { OutboxRepository } from './outbox.repository';
import { Transaction } from './transaction.model';

@Injectable()
export class OutboxServiceImpl implements OutboxService {
  constructor(private readonly outboxRepository: OutboxRepository) {}

  async publish(): Promise<Transaction> {
    const transaction = Transaction.create();
    await this.outboxRepository.save(transaction);
    return transaction;
  }

  async getTransaction(transactionId: string): Promise<Transaction | null> {
    const status = await this.outboxRepository.getStatus(transactionId);

    if (!status) {
      return null;
    }

    return Transaction.from({
      id: transactionId,
      status,
      createdDate: LocalDateTime.now(),
      updatedDate: LocalDateTime.now(),
    });
  }

  async save(transaction: Transaction): Promise<void> {
    await this.outboxRepository.save(transaction);
  }
}
