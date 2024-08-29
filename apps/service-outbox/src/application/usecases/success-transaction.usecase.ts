import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { OutboxService } from '../../domain/services';

@Injectable()
export class SuccessTransactionUseCase {
  constructor(
    private readonly outboxService: OutboxService,
    @InjectLogger() private readonly logger: LoggerService,
  ) {}

  async execute({ transactionId }: { transactionId: string }): Promise<void> {
    await this.outboxService.successTransaction(transactionId);

    this.logger.info(`[Outbox] Successed transaction: ${transactionId}`);
  }
}
