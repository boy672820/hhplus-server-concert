import { Type } from '@nestjs/common';
import {
  ActivateQueueUsersUseCase,
  ExpireQueueUsersUseCase,
  FindAvailableSeatsUseCase,
  FindEventSchedulesUseCase,
  FindEventsUseCase,
  FindSchedulesBetweenUseCase,
  GenerateTokenUsecase,
  PayReservationUseCase,
  RechargePointUseCase,
  ReserveUseCase,
  ValidateQueueUseCase,
} from './usecases';
import { ReserveSeatHandler } from './commands/reserve-seat.handler';
import { ReservationReservedSeatHandler } from './events/reservation-reserved-seat.handler';
import { ReservationCancelledHandler } from './events/reservation-cancelled.handler';
import { CancelReservationHandler } from './commands/cancel-reservation.handler';
import { ReservationSagas } from './sagas/reservation.saga';

export const usecases: Type<any>[] = [
  GenerateTokenUsecase,
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
];

export const commands: Type<any>[] = [
  ReserveSeatHandler,
  CancelReservationHandler,
];

export const events: Type<any>[] = [
  ReservationReservedSeatHandler,
  ReservationCancelledHandler,
];

export const sagas: Type<any>[] = [ReservationSagas];
