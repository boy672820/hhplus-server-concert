import { OutboxService } from '@libs/outbox';
import { InjectOutbox } from '@libs/outbox/decorators';
import { Injectable } from '@nestjs/common';
import { OutboxAdapter } from '../../domain/adapters';
import { Transaction } from '../../domain/models';
import { OutboxMapper } from '../mappers/outbox.mapper';

@Injectable()
export class OutboxAdapterImpl extends OutboxAdapter {
  constructor(@InjectOutbox() private readonly outboxService: OutboxService) {
    super();
  }

  async save(transaction: Transaction): Promise<void> {}
}
