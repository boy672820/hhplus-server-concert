import { Type } from '@nestjs/common';
import { EventService } from './services/event.service';
import { SeatService } from './services/seat.service';
import { ReservationService } from './services/reservation.service';

export const services: Type<any>[] = [
  EventService,
  SeatService,
  ReservationService,
];
