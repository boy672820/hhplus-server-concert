import { LocalDateTime } from '@libs/domain/types';
import { Schedule } from '../models';

export abstract class ScheduleRepository {
  abstract findById(id: string): Promise<Schedule | null>;
  abstract findBetweenByEventId(
    eventId: string,
    between: { startDate: LocalDateTime; endDate: LocalDateTime },
  ): Promise<Schedule[]>;
  abstract findBetween(between: {
    startDate: LocalDateTime;
    endDate: LocalDateTime;
  }): Promise<Schedule[]>;
}
