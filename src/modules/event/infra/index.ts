import { Provider } from '@nestjs/common';
import { EventRepository, ScheduleRepository } from '../domain/repositories';
import { EventRepositoryImpl } from './repositories/event.repository';
import { ScheduleRepositoryImpl } from './repositories/schedule.repository';
import { SeatRepository } from '../domain/repositories/seat.repository';
import { SeatRepositoryImpl } from './repositories/seat.repository';

export const repositories: Provider[] = [
  {
    provide: EventRepository,
    useClass: EventRepositoryImpl,
  },
  {
    provide: ScheduleRepository,
    useClass: ScheduleRepositoryImpl,
  },
  {
    provide: SeatRepository,
    useClass: SeatRepositoryImpl,
  },
];
