import { Type } from '@nestjs/common';
import {
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
];
