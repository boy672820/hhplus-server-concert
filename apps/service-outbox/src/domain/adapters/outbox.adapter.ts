import { Transaction } from '../models';

export abstract class OutboxAdapter {
  abstract getTransaction(transactionId: string): Promise<Transaction | null>;
  abstract save(transaction: Transaction): Promise<void>;
}
