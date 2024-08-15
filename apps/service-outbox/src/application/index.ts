import { Type } from '@nestjs/common';
import { PublishReservedSeatUseCase } from './usecases';

export const usecases: Type<any>[] = [PublishReservedSeatUseCase];
