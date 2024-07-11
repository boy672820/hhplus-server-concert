import { Provider } from '@nestjs/common';
import {
  EventRepository,
  ReservationRepository,
  ScheduleRepository,
} from '../domain/repositories';
import { EventRepositoryImpl } from './repositories/event.repository';
import { ScheduleRepositoryImpl } from './repositories/schedule.repository';
import { SeatRepository } from '../domain/repositories/seat.repository';
import { SeatRepositoryImpl } from './repositories/seat.repository';
import { ReservationRepositoryImpl } from './repositories/reservation.repository';

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
  {
    provide: ReservationRepository,
    useClass: ReservationRepositoryImpl,
  },
];
