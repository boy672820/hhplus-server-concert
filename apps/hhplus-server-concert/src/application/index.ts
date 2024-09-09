import { Type } from '@nestjs/common';
import {
  ActivateQueueUsersUseCase,
  ExpireQueueUsersUseCase,
  FindAvailableSeatsUseCase,
  FindEventSchedulesUseCase,
  FindEventsUseCase,
  FindSchedulesBetweenUseCase,
  PayReservationUseCase,
  RechargePointUseCase,
  ReserveUseCase,
  SignQueueUserUseCase,
  ValidateQueueUseCase,
} from './usecases';
import { ReserveSeatHandler } from './commands/reserve-seat.handler';
import { CancelReservationHandler } from './commands/cancel-reservation.handler';
import { ReservationCreatedHandler } from './events/reservation-created.handler';
import { ReservationCancelledHandler } from './events/reservation-cancelled.handler';
import { ReservationPaidHandler } from './events/reservation-paid.handler';
import { SeatReservedHandler } from './events/seat-reserved.handler';
import { QueueUserExpiredHandler } from './events/queue-user-expired.handler';
import { ReservationSagas } from './sagas/reservation.saga';

export const usecases: Type<any>[] = [
  FindEventsUseCase,
  FindSchedulesBetweenUseCase,
  FindAvailableSeatsUseCase,
  ReserveUseCase,
  PayReservationUseCase,
  ValidateQueueUseCase,
  ActivateQueueUsersUseCase,
  ExpireQueueUsersUseCase,
  RechargePointUseCase,
  FindEventSchedulesUseCase,
  SignQueueUserUseCase,
];

export const commands: Type<any>[] = [
  ReserveSeatHandler,
  CancelReservationHandler,
];

export const events: Type<any>[] = [
  ReservationCreatedHandler,
  ReservationCancelledHandler,
  ReservationPaidHandler,
  SeatReservedHandler,
  QueueUserExpiredHandler,
];

export const sagas: Type<any>[] = [ReservationSagas];
