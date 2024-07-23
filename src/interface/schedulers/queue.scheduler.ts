import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  ActivateQueueUsersUseCase,
  ExpireQueueUsersUseCase,
} from '../../application/usecases';

@Injectable()
export class QueueScheduler {
  constructor(
    private readonly activateQueueUsersUseCase: ActivateQueueUsersUseCase,
    private readonly expireQueueUsersUseCase: ExpireQueueUsersUseCase,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleActivateQueueUsers() {
    await this.activateQueueUsersUseCase.execute();
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  async handleExpireQueueUsers() {
    await this.expireQueueUsersUseCase.execute();
  }
}
