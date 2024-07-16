import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ActivateQueueUsersUseCase } from '../../application/usecases';

@Injectable()
export class QueueScheduler {
  constructor(
    private readonly activateQueueUsersUseCase: ActivateQueueUsersUseCase,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
    console.log('QueueScheduler: handleCron');
    await this.activateQueueUsersUseCase.execute();
  }
}
