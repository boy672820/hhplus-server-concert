import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { RetriedTransactionEvent } from '../../domain/events';
import { OutboxService } from '../../domain/services';

@EventsHandler(RetriedTransactionEvent)
export class RetriedTransactionHandler
  implements IEventHandler<RetriedTransactionEvent>
{
  constructor(
    private readonly outboxService: OutboxService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  handle(event: RetriedTransactionEvent) {
    const { transactionId, eventType, payload } = event;

    this.outboxService.emitTransaction(eventType, payload);

    this.logger.info(
      `[RetriedTransactionEvent] Transaction ${transactionId} has been retried with event type ${eventType}.`,
    );
  }
}
