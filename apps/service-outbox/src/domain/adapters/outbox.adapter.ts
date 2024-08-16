import { TransactionStatus } from '@libs/domain/types';
import { Transaction } from '../models';

export abstract class OutboxAdapter {
  abstract getPendingTransactions(): Promise<Transaction[]>;
  abstract getTransactionByStatus(
    status: TransactionStatus,
    transactionId: string,
  ): Promise<Transaction | null>;
  abstract save(transaction: Transaction): Promise<void>;
}
