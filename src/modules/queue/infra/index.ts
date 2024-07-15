import { Provider } from '@nestjs/common';
import { QueueRepository } from '../domain/repositories';
import { QueueRepositoryImpl } from './repositories/queue.repository';

export const repositories: Provider[] = [
  {
    provide: QueueRepository,
    useClass: QueueRepositoryImpl,
  },
];
