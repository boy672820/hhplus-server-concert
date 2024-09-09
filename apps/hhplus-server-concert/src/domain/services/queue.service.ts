import { LocalDateTime } from '@libs/domain/types';
import { DomainError } from '@libs/common/errors';
import { Injectable } from '@nestjs/common';
import { QueueRepository } from '../repositories';
import { QueueUser } from '../models';

@Injectable()
export class QueueService {
  constructor(private readonly queueRepository: QueueRepository) {}

  async enterUser(userId: string): Promise<QueueUser> {
    const queueUser = QueueUser.createWaiting({ userId });
    await this.queueRepository.enqueue(queueUser);
    return queueUser;
  }

  sign(queue: QueueUser): string {
    return queue.sign();
  }

  verifyToken(token: string): { userId: string; expiresDate: LocalDateTime } {
    const userInfo = QueueUser.parse(token);
    return userInfo;
  }

  async checkActive(userId: string): Promise<QueueUser> {
    const user = await this.queueRepository.getActiveUser(userId);

    if (!user) {
      throw DomainError.forbidden('사용자가 활성화되지 않았습니다.');
    }

    return user;
  }

  async expire(userId: string): Promise<void> {
    const user = await this.queueRepository.dequeueActive(userId);

    if (!user) {
      throw DomainError.notFound('사용자를 찾을 수 없습니다.');
    }

    user.expire();
    user.commit();
  }

  async activateQueueUsers(): Promise<QueueUser[]> {
    const users = await this.queueRepository.dequeueWaitingByLimit(
      QueueUser.ACTIVE_LIMIT,
    );
    await this.queueRepository.activate(users);
    return users;
  }

  async expireQueueUsers(): Promise<{ count: number }> {
    const { count } = await this.queueRepository.expire();
    return { count };
  }
}
