import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PublishOutboxCommand } from './publish-outbox.command';
import { OutboxService } from '../../domain/services';

@CommandHandler(PublishOutboxCommand)
export class PublishOutboxHandler
  implements ICommandHandler<PublishOutboxCommand, void>
{
  constructor(
    private readonly outboxService: OutboxService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async execute(): Promise<void> {
    const transaction = await this.outboxService.store();

    this.logger.info(
      `[Outbox] New transaction "${transaction.id}" published (status: ${transaction.status})`,
    );
  }
}
