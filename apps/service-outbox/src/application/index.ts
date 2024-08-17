import { Type } from '@nestjs/common';
import {
  ProgressTransactionUseCase,
  RetryPendingMessagesUseCase,
  SuccessTransactionUseCase,
} from './usecases';
import { RetriedTransactionHandler } from './events/retried-transaction.handler';

export const usecases: Type<any>[] = [
  ProgressTransactionUseCase,
  SuccessTransactionUseCase,
  RetryPendingMessagesUseCase,
];

export const events: Type<any>[] = [RetriedTransactionHandler];
