import { QueueUser } from '../models';

export abstract class QueueRepository {
  abstract enqueue(queueUser: QueueUser): Promise<void>;
  abstract dequeueWaitingByLimit(limit: number): Promise<QueueUser[]>;
  abstract activate(queueUsers: QueueUser[]): Promise<void>;
  abstract expire(): Promise<{ count: number }>;
  abstract getActiveUser(userId: string): Promise<QueueUser | null>;
  abstract dequeueActive(userId: string): Promise<QueueUser | null>;
}
