import { Type } from '@nestjs/common';
import { EventController } from './controllers/event.controller';
import { ScheduleController } from './controllers/schedule.controller';
import { ReservationController } from './controllers/reservation.controller';

export const controllers: Type<any>[] = [
  EventController,
  ScheduleController,
  ReservationController,
];
