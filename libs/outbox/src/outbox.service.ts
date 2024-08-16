import { EventType, TransactionStatus } from '@libs/domain/types';
import { Transaction } from './transaction.model';

export interface OutboxService {
  publish(type: EventType, payload: Record<string, any>): Promise<Transaction>;
  getTransactionByStatus(
    status: TransactionStatus,
    transactionId: string,
  ): Promise<Transaction | null>;
  save(transaction: Transaction): Promise<void>;
  getPendingTransactions(): Promise<Transaction[]>;
}
