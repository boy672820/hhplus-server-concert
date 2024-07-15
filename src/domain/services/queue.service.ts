import { Injectable } from '@nestjs/common';
import { QueueRepository } from '../repositories';
import { Queue } from '../models';

@Injectable()
export class QueueService {
  constructor(private readonly queueRepository: QueueRepository) {}

  async enqueue(userId: string): Promise<Queue> {
    const queue = Queue.create({ userId });
    const sequence = await this.queueRepository.create(queue);
    return sequence;
  }

  generateToken(queue: Queue): string {
    return queue.generateToken();
  }
}
