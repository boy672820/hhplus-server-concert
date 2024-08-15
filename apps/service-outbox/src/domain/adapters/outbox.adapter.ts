import { Transaction } from '../models';

export abstract class OutboxAdapter {
  abstract save(transaction: Transaction): Promise<void>;
}
