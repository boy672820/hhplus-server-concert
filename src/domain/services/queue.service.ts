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

  async expire(userId: string): Promise<Queue> {
    const queue = await this.queueRepository.findByUserId(userId);

    if (!queue) {
      throw DomainError.notFound('사용자를 찾을 수 없습니다.');
    }

    queue.expire();

    await this.queueRepository.save(queue);

    return queue;
  }
}
