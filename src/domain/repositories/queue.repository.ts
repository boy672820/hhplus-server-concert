import { LocalDateTime } from '@lib/types';
import { Queue } from '../models';

export abstract class QueueRepository {
  abstract create(input: {
    userId: string;
    isAvailable: boolean;
    expiresDate: LocalDateTime;
  }): Promise<Queue>;
}
