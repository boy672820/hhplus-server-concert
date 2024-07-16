import { Injectable } from '@nestjs/common';
import { QueueService } from '../../domain/services';

@Injectable()
export class ActivateQueueUsersUseCase {
  constructor(private readonly queueService: QueueService) {}

  async execute(): Promise<void> {
    await this.queueService.activateQueueUsers();
  }
}
