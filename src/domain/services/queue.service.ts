import { Injectable } from '@nestjs/common';
import { QueueRepository } from '../repositories';
import { Queue } from '../models';
import { DomainError } from '../../lib/errors';

const QUEUE_USER_ACTIVE_LIMIT = 10;

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
    const user = await this.queueRepository.findLastestByUserId(queue.userId);

    if (!user) {
      throw DomainError.notFound('사용자를 찾을 수 없습니다.');
    }

    user.checkAvailable();

    return queue;
  }

  async expire(userId: string): Promise<void> {
    const queue = await this.queueRepository.findLastestByUserId(userId);

    if (!queue) {
      throw DomainError.notFound('사용자를 찾을 수 없습니다.');
    }

    queue.expire();

    await this.queueRepository.save(queue);
  }

  async activateQueueUsers(): Promise<void> {
    const activeCount = await this.queueRepository.getActiveCount();

    if (activeCount >= QUEUE_USER_ACTIVE_LIMIT) {
      return;
    }

    const total = QUEUE_USER_ACTIVE_LIMIT - activeCount;

    const users = await this.queueRepository.findWaitingUsersByLimit(total);

    users.forEach((user) => {
      user.activate();
    });

    await this.queueRepository.save(users);
  }
}
