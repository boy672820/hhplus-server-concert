import { Type } from '@nestjs/common';
import {
  EventService,
  OutboxService,
  PaymentService,
  PointService,
  QueueService,
  ReservationService,
  SeatService,
} from './services';
import { ReservationFactory } from './factories/reservation.factory';

export const services: Type<any>[] = [
  QueueService,
  PointService,
  EventService,
  SeatService,
  ReservationService,
  PaymentService,
  OutboxService,
];

export const factories: Type<any>[] = [ReservationFactory];
