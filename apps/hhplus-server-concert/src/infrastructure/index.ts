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
import { PaymentRepositoryImpl } from './repositories/payment.repository';
import { ReservationProducer } from '../domain/producers';
import { ReservationProducerImpl } from './producers/reservation.producer';
import { OutboxAdapter } from '../domain/adapters';
import { OutboxAdapterImpl } from './adapters/outbox.adapter';
import { ReservationMapper } from './mappers/reservation.mapper';
import { SeatMapper } from './mappers/seat.mapper';
import { QueueUserMapper } from './mappers/queue-user.mapper';

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

export const producers: Provider[] = [
  {
    provide: ReservationProducer,
    useClass: ReservationProducerImpl,
  },
];

export const mappers: Provider[] = [
  ReservationMapper,
  SeatMapper,
  QueueUserMapper,
];

export const adapters: Provider[] = [
  {
    provide: OutboxAdapter,
    useClass: OutboxAdapterImpl,
  },
];
