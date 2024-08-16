import { Transaction as Payload } from '@libs/outbox/transaction.model';
import { Injectable } from '@nestjs/common';
import { Transaction } from '../../domain/models';
import { TransactionFactory } from '../../domain/factories';

@Injectable()
export class TransactionMapper {
  constructor(private readonly transactionFactory: TransactionFactory) {}

  toModel = (payload: Payload): Transaction =>
    this.transactionFactory.reconstitute({
      id: payload.id,
      type: payload.type,
      status: payload.status,
      payload: payload.payload,
      createdDate: payload.createdDate,
      updatedDate: payload.updatedDate,
    });
}
