import { LocalDateTime } from '@lib/types';
import { Schedule } from '../models';

export abstract class ScheduleRepository {
  abstract findBetween(between: {
    startDate: LocalDateTime;
    endDate: LocalDateTime;
  }): Promise<Schedule[]>;
}
