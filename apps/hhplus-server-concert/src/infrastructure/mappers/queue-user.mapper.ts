import { Injectable } from '@nestjs/common';
import { QueueUser } from '../../domain/models';
import { QueueUserFactory } from '../../domain/factories';

@Injectable()
export class QueueUserMapper {
  constructor(private readonly queueUserFactory: QueueUserFactory) {}

  createActive = (userId: string): QueueUser =>
    this.queueUserFactory.createActive({ userId });
}
