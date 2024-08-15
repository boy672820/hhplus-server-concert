import { Injectable } from '@nestjs/common';
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
}
