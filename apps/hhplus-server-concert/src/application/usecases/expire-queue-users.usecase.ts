import { InjectLogger } from '@libs/logger/decorators';
import { Injectable } from '@nestjs/common';
import { LoggerService } from '@libs/logger';
import { QueueService } from '../../domain/services';

@Injectable()
export class ExpireQueueUsersUseCase {
  constructor(
    private readonly queueService: QueueService,
    @InjectLogger() private readonly logger: LoggerService,
  ) {}

  async execute(): Promise<void> {
    const { count } = await this.queueService.expireQueueUsers();

    this.logger.info(
      `Expired queue users: ${count}`,
      'ExpireQueueUsersUseCase',
    );
  }
}
