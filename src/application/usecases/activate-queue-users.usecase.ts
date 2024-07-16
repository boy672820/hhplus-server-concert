import { Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';
import { QueueService } from '../../domain/services';

@Injectable()
export class ActivateQueueUsersUseCase {
  constructor(private readonly queueService: QueueService) {}

  @Transactional()
  async execute(): Promise<void> {
    await this.queueService.activateQueueUsers();
  }
}
