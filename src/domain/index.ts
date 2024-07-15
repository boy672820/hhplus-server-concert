import { Type } from '@nestjs/common';
import {
  EventService,
  PaymentService,
  PointService,
  QueueService,
  ReservationService,
  SeatService,
} from './services';

export const services: Type<any>[] = [
  QueueService,
  PointService,
  EventService,
  SeatService,
  ReservationService,
  PaymentService,
];
