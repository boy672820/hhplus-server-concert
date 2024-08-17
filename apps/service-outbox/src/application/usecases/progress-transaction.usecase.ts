import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { OutboxService } from '../../domain/services';

@Injectable()
export class ProgressTransactionUseCase {
  constructor(
    private readonly outboxService: OutboxService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async execute({ transactionId }: { transactionId: string }): Promise<void> {
    await this.outboxService.progressTransaction(transactionId);

    this.logger.info(`[Outbox] Progressed transaction: ${transactionId}`);
  }
}
