import { Provider } from '@nestjs/common';
import {
  EventRepository,
  PaymentRepository,
  PointRepository,
  QueueRepository,
  ReservationRepository,
  ScheduleRepository,
  SeatRepository,
} from '../domain/repositories';
import { QueueRepositoryImpl } from './repositories/queue.repository';
import { PointRepositoryImpl } from './repositories/point.repository';
import { EventRepositoryImpl } from './repositories/event.repository';
import { ScheduleRepositoryImpl } from './repositories/schedule.repository';
import { SeatRepositoryImpl } from './repositories/seat.repository';
import { ReservationRepositoryImpl } from './repositories/reservation.repository';
import { PaymentRepositoryImpl } from './repositories/payment.repositor';

export const repositories: Provider[] = [
  {
    provide: QueueRepository,
    useClass: QueueRepositoryImpl,
  },
  {
    provide: PointRepository,
    useClass: PointRepositoryImpl,
  },
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
    provide: PaymentRepository,
    useClass: PaymentRepositoryImpl,
  },
];
