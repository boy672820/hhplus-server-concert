import { DomainError } from '@libs/common/errors';
import { Injectable } from '@nestjs/common';
import { OutboxAdapter } from '../adapters';

@Injectable()
export class OutboxService {
  constructor(private readonly outboxAdapter: OutboxAdapter) {}

  async progressTransaction(transactionId: string): Promise<void> {
    const transaction = await this.outboxAdapter.getTransaction(transactionId);

    if (!transaction) {
      throw DomainError.notFound('트랜잭션을 찾을 수 없습니다.');
    }

    transaction.progress();

    await this.outboxAdapter.save(transaction);
  }
}
