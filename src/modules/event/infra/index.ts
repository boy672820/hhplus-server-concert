import { Provider } from '@nestjs/common';
import {
  EventRepository,
  PaymentRepository,
  ReservationRepository,
  ScheduleRepository,
  UserPointRepository,
} from '../domain/repositories';
import { EventRepositoryImpl } from './repositories/event.repository';
import { ScheduleRepositoryImpl } from './repositories/schedule.repository';
import { SeatRepository } from '../domain/repositories/seat.repository';
import { SeatRepositoryImpl } from './repositories/seat.repository';
import { ReservationRepositoryImpl } from './repositories/reservation.repository';
import { UserPointRepositoryImpl } from './repositories/user-point.repository';
import { PaymentRepositoryImpl } from './repositories/payment.repositor';

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
  {
    provide: UserPointRepository,
    useClass: UserPointRepositoryImpl,
  },
  {
    provide: PaymentRepository,
    useClass: PaymentRepositoryImpl,
  },
];
