import { Transaction } from './transaction.model';

export interface OutboxService {
  publish(): Promise<Transaction>;
}
