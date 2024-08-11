import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { QueueService } from '../../domain/services';

@Injectable()
export class ExpireQueueUsersUseCase {
  constructor(
    private readonly queueService: QueueService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async execute(): Promise<void> {
    const { count } = await this.queueService.expireQueueUsers();

    this.logger.info(`Expired queue users: ${count}`);
  }
}
