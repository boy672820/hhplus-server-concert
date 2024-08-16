import { Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { Transaction, TransactionProps } from '../models';

@Injectable()
export class TransactionFactory {
  constructor(private readonly eventPublisher: EventPublisher) {}

  reconstitute = (props: TransactionProps) =>
    this.eventPublisher.mergeObjectContext(Transaction.from(props));
}
