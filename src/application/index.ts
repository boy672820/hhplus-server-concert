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
