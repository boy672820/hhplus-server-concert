import { Provider } from '@nestjs/common';
import { TransactionRepository } from '../domain/repositories';
import { TransactionRepositoryImpl } from './repositories/transaction.repository';

export const repositories: Provider[] = [
  {
    provide: TransactionRepository,
    useClass: TransactionRepositoryImpl,
  },
];
