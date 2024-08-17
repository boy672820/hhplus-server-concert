import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RetryPendingMessagesUseCase } from '../../application/usecases';

@Injectable()
export class OutboxScheduler {
  constructor(
    private readonly retryPendingMessagesUseCase: RetryPendingMessagesUseCase,
  ) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  async handleRetryPendingMessages() {
    await this.retryPendingMessagesUseCase.execute();
  }
}
