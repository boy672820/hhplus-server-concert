import { LocalDateTime } from '@lib/types';
import { Schedule } from '../models';

export abstract class ScheduleRepository {
  abstract findById(id: string): Promise<Schedule | null>;
  abstract findBetween(between: {
    startDate: LocalDateTime;
    endDate: LocalDateTime;
  }): Promise<Schedule[]>;
}
