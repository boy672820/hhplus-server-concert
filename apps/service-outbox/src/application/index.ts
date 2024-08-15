import { Type } from '@nestjs/common';
import { ProgressTransactionUseCase } from './usecases';

export const usecases: Type<any>[] = [ProgressTransactionUseCase];
