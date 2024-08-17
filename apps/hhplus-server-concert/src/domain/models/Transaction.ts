import { LocalDateTime, TransactionStatus } from '@libs/domain/types';

export type Transaction = {
  id: string;
  status: TransactionStatus;
  createdDate: LocalDateTime;
  updatedDate: LocalDateTime;
};
