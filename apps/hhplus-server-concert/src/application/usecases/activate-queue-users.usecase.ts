import { InjectLogger } from '@libs/logger/decorators';
import { Injectable } from '@nestjs/common';
import { LoggerService } from '@libs/logger';
import { QueueService } from '../../domain/services';

@Injectable()
export class ActivateQueueUsersUseCase {
  constructor(
    private readonly queueService: QueueService,
    @InjectLogger() private readonly logger: LoggerService,
  ) {}

  async execute(): Promise<void> {
    const activeUsers = await this.queueService.activateQueueUsers();

    this.logger.info('Activated queue users', 'ActivateQueueUsersUseCase', {
      count: activeUsers.length,
    });
  }
}
