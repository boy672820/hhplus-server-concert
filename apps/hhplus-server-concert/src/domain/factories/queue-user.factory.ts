import { Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { QueueUserProps, QueueUser, QueueUserCreateProps } from '../models';

@Injectable()
export class QueueUserFactory {
  constructor(private readonly eventPublisher: EventPublisher) {}

  createWaiting = (props: QueueUserCreateProps): QueueUser =>
    this.eventPublisher.mergeObjectContext(QueueUser.createWaiting(props));

  createActive = (props: QueueUserCreateProps): QueueUser =>
    this.eventPublisher.mergeObjectContext(QueueUser.createActive(props));

  reconstitute = (props: QueueUserProps): QueueUser =>
    this.eventPublisher.mergeObjectContext(QueueUser.from(props));
}
