import { TransactionStatus } from '@libs/domain/types';
import { OutboxService } from '@libs/outbox';
import { InjectOutbox } from '@libs/outbox/decorators';
import { Injectable } from '@nestjs/common';
import { OutboxAdapter } from '../../domain/adapters';
import { Transaction } from '../../domain/models';
import { TransactionMapper } from '../mappers/transaction.mapper';

@Injectable()
export class OutboxAdapterImpl extends OutboxAdapter {
  constructor(
    @InjectOutbox() private readonly outboxService: OutboxService,
    private readonly transactionMapper: TransactionMapper,
  ) {
    super();
  }

  async save(transaction: Transaction): Promise<void> {
    await this.outboxService.save(transaction);
  }

  async getTransactionByStatus(
    status: TransactionStatus,
    transactionId: string,
  ): Promise<Transaction | null> {
    const transaction = await this.outboxService.getTransactionByStatus(
      status,
      transactionId,
    );
    return transaction ? this.transactionMapper.toModel(transaction) : null;
  }

  async getPendingTransactions(): Promise<Transaction[]> {
    const transactions = await this.outboxService.getPendingTransactions();
    return transactions.map(this.transactionMapper.toModel);
  }
}
