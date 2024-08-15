import { Injectable } from '@nestjs/common';
import { OutboxAdapter } from '../adapters';
import { Transaction } from '../models';

@Injectable()
export class OutboxService {
  constructor(private readonly outboxAdapter: OutboxAdapter) {}

  async store(): Promise<Transaction> {
    const transaction = await this.outboxAdapter.publish();
    return transaction;
  }
}
