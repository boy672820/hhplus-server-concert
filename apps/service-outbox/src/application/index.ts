import { Type } from '@nestjs/common';
import {
  ProgressTransactionUseCase,
  SuccessTransactionUseCase,
} from './usecases';

export const usecases: Type<any>[] = [
  ProgressTransactionUseCase,
  SuccessTransactionUseCase,
];
