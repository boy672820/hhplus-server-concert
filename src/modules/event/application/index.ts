import { Type } from '@nestjs/common';
import { FindEventsUseCase } from './usecases';

export const useCases: Type<any>[] = [FindEventsUseCase];
