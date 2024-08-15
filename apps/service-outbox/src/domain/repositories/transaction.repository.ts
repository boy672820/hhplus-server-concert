import { Transaction } from '../models';

export abstract class TransactionRepository {
  abstract save(transaction: Transaction): Promise<void>;
}
