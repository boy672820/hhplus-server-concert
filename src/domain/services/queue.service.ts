import { Injectable } from '@nestjs/common';
import { QueueRepository } from '../repositories';
import { Queue } from '../models';
import { DomainError } from '../../lib/errors';

@Injectable()
export class QueueService {
  constructor(private readonly queueRepository: QueueRepository) {}

  async enqueue(userId: string): Promise<Queue> {
    const queue = Queue.create({ userId });
    const sequence = await this.queueRepository.create(queue);
    return sequence;
  }

  sign(queue: Queue): string {
    return queue.sign();
  }

  parse(token: string): Queue {
    const queue = Queue.parse(token);
    return queue;
  }

  async verify(queue: Queue): Promise<Queue> {
    const user = await this.queueRepository.findByUserId(queue.userId);

    if (!user) {
      throw DomainError.notFound('사용자를 찾을 수 없습니다.');
    }

    user.checkAvailable();

    return queue;
  }
}
