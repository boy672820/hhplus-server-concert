import { Transaction } from '../models';

export abstract class OutboxAdapter {
  abstract publish(): Promise<Transaction>;
}
