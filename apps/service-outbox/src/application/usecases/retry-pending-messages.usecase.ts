import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { OutboxService } from '../../domain/services';

@Injectable()
export class RetryPendingMessagesUseCase {
  constructor(
    private readonly outboxService: OutboxService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async execute(): Promise<void> {
    const count = await this.outboxService.retryPendingMessages();

    this.logger.info(`[batch] ${count} pending messages retried`);
  }
}