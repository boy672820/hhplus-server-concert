import { Injectable } from '@nestjs/common';
import { QueueRepository } from '../../domain/repositories';
import { QueueUser } from '../../domain/models';

@Injectable()
export class ActiveQueueUserSeeder {
  constructor(private readonly queueRepository: QueueRepository) {}

  async execute({ userId }: { userId: string }): Promise<void> {
    const user = QueueUser.createWaiting({ userId });

    await this.queueRepository.activate([user]);
  }
}
