import { Provider } from '@nestjs/common';
import { EventRepository } from '../domain/repositories';
import { EventRepositoryImpl } from './repositories/event.repository';

export const repositories: Provider[] = [
  {
    provide: EventRepository,
    useClass: EventRepositoryImpl,
  },
];
