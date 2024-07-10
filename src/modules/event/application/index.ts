import { Type } from '@nestjs/common';
import { FindEventsUseCase, FindSchedulesBetweenUseCase } from './usecases';

export const useCases: Type<any>[] = [
  FindEventsUseCase,
  FindSchedulesBetweenUseCase,
];
