import { Injectable } from '@nestjs/common';
import { Transaction } from '../models';
import { TransactionRepository } from '../repositories';

@Injectable()
export class OutboxService {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async createTransaction(): Promise<Transaction> {
    const transaction = Transaction.create();
    await this.transactionRepository.save(transaction);
    return transaction;
  }
}
