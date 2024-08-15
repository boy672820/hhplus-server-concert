import { Transaction as Payload } from '@libs/outbox/transaction.model';
import { Transaction } from '../../domain/models';

export class OutboxMapper {
  static toModel = (payload: Payload): Transaction =>
    Transaction.from({
      id: payload.id,
      status: payload.status,
      createdDate: payload.createdDate,
      updatedDate: payload.updatedDate,
    });
}
