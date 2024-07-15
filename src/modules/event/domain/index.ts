import { Type } from '@nestjs/common';
import { EventService } from './services/event.service';
import { SeatService } from './services/seat.service';
import { ReservationService } from './services/reservation.service';
import { UserPointService } from './services/user-point.service';
import { PaymentService } from './services';

export const services: Type<any>[] = [
  EventService,
  SeatService,
  ReservationService,
  UserPointService,
  PaymentService,
];
