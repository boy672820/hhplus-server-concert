import { Type } from '@nestjs/common';
import {
  FindEventsUseCase,
  FindSchedulesBetweenUseCase,
  FindAvailableSeatsUseCase,
} from './usecases';

export const useCases: Type<any>[] = [
  FindEventsUseCase,
  FindSchedulesBetweenUseCase,
  FindAvailableSeatsUseCase,
];
