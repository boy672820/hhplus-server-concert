import { Type } from '@nestjs/common';
import { ReserveSeatUseCase } from './usecases';

export const usecases: Type<any>[] = [ReserveSeatUseCase];
