import { Transaction } from './transaction.model';

export interface OutboxService {
  publish(): Promise<Transaction>;
  getTransaction(transactionId: string): Promise<Transaction | null>;
  save(transaction: Transaction): Promise<void>;
}
