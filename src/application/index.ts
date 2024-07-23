import { Type } from '@nestjs/common';
import {
  ActivateQueueUsersUseCase,
  ExpireQueueUsersUseCase,
  FindAvailableSeatsUseCase,
  FindEventsUseCase,
  FindSchedulesBetweenUseCase,
  GenerateTokenUsecase,
  PayReservationUseCase,
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
];
