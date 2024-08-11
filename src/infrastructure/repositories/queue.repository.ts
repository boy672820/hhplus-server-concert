import { InjectRedis } from '@lib/decorators';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { QueueRepository } from '../../domain/repositories';
import { QueueUser } from '../../domain/models';
import { QueueUserMapper } from '../mappers/queue-user.mapper';

@Injectable()
export class QueueRepositoryImpl implements QueueRepository {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async enqueue(queueUser: QueueUser): Promise<void> {
    await this.redis.zadd(
      'queue-users:waiting',
      queueUser.expiresDate.toEpochMilli(),
      queueUser.userId,
    );
  }

  async dequeueWaitingByLimit(limit: number): Promise<QueueUser[]> {
    const replies = await this.redis
      .multi()
      .zrange('queue-users:waiting', 0, limit - 1)
      .zremrangebyrank('queue-users:waiting', 0, limit - 1)
      .exec();

    if (!replies) {
      throw new Error('Redis transaction failed');
    }

    const [[zrangeError, members], [zremrangebyrankError]] = replies;

    if (zrangeError || zremrangebyrankError) {
      throw zrangeError || zremrangebyrankError;
    }

    return (members as string[]).map((userId) =>
      QueueUserMapper.createActive(userId),
    );
  }

  async activate(queueUsers: QueueUser[]): Promise<void> {
    const users = queueUsers.map((user) => user.userId);

    if (users.length === 0) {
      return;
    }

    await this.redis.sadd('queue-users:active', users);
  }

  async expire(): Promise<{ count: number }> {
    const count = await this.redis.zremrangebyscore(
      'queue-users:waiting',
      0,
      Date.now(),
    );

    return { count };
  }

  async getActiveUser(userId: string): Promise<QueueUser | null> {
    const result = await this.redis.sismember('queue-users:active', userId);

    if (result === 0) {
      return null;
    }

    return QueueUserMapper.createActive(userId);
  }

  async dequeueActive(userId: string): Promise<QueueUser | null> {
    const result = await this.redis.srem('queue-users:active', userId);

    if (result === 0) {
      return null;
    }

    return QueueUserMapper.createActive(userId);
  }
}
