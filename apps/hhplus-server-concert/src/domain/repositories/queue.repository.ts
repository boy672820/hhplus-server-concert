import { LocalDateTime, QueueStatus } from '@libs/domain/types';
import { Queue } from '../models';

export abstract class QueueRepository {
  abstract create(input: {
    userId: string;
    status: QueueStatus;
    expiresDate: LocalDateTime;
  }): Promise<Queue>;
  abstract findLastestByUserId(userId: string): Promise<Queue | null>;
  abstract save(queue: Queue | Queue[]): Promise<void>;
  abstract getActiveCount(): Promise<number>;
  abstract findWaitingUsersByLimit(limit: number): Promise<Queue[]>;
  abstract findActiveUsers(): Promise<Queue[]>;
}
