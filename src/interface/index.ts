import { Type } from '@nestjs/common';
import { QueueController } from './controllers/queue.controller';
import { PointController } from './controllers/point.controller';
import { EventController } from './controllers/event.controller';
import { ScheduleController } from './controllers/schedule.controller';
import { ReservationController } from './controllers/reservation.controller';
import { PaymentController } from './controllers/payment.controller';

export const controllers: Type<any>[] = [
  QueueController,
  PointController,
  EventController,
  ScheduleController,
  ReservationController,
  PaymentController,
];
