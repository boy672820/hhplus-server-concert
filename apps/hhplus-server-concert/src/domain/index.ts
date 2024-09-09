import { Type } from '@nestjs/common';
import {
  EventService,
  PaymentService,
  PointService,
  QueueService,
  ReservationService,
  SeatService,
} from './services';
import { ReservationFactory, SeatFactory, QueueUserFactory } from './factories';

export const services: Type<any>[] = [
  QueueService,
  PointService,
  EventService,
  SeatService,
  ReservationService,
  PaymentService,
];

export const factories: Type<any>[] = [
  ReservationFactory,
  SeatFactory,
  QueueUserFactory,
];
