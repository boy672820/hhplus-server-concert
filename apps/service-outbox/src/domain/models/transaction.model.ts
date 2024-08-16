import {
  EventType,
  LocalDateTime,
  TransactionStatus,
} from '@libs/domain/types';
import { Transaction as OutboxTransaction } from '@libs/outbox/transaction.model';
import { RetriedTransactionEvent } from '../events';

export interface TransactionProps {
  id: string;
  type: EventType;
  status: TransactionStatus;
  payload: string;
  createdDate: LocalDateTime;
  updatedDate: LocalDateTime;
}

export class Transaction extends OutboxTransaction {
  static from = (props: TransactionProps): Transaction =>
    new Transaction(props);

  autoRetry(): boolean {
    if (
      this.status !== TransactionStatus.Pending ||
      this.createdDate.plusMinutes(1).isAfter(LocalDateTime.now())
    ) {
      return false;
    }

    this.apply(
      new RetriedTransactionEvent(this.id, this.type, this.getPayload()),
    );
    this.commit();

    return true;
  }
}
