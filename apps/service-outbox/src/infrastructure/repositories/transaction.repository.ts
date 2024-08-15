import { InjectRedis } from '@libs/redis/decorators';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { TransactionRepository } from '../../domain/repositories';
import { Transaction } from '../../domain/models';

@Injectable()
export class TransactionRepositoryImpl extends TransactionRepository {
  constructor(@InjectRedis() private readonly redis: Redis) {
    super();
  }

  async save(transaction: Transaction): Promise<void> {
    console.log(transaction);
  }
}
