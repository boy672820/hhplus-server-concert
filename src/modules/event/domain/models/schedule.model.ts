import { LocalDateTime } from '@lib/types';
import { ulid } from 'ulid';

export interface ScheduleProps {
  id: string;
  startDate: LocalDateTime;
  endDate: LocalDateTime;
}

export class Schedule {
  id: string;
  startDate: LocalDateTime;
  endDate: LocalDateTime;

  private constructor(props: Schedule) {
    Object.assign(this, props);
  }

  static create = (
    props: Pick<ScheduleProps, 'startDate' | 'endDate'>,
  ): Schedule => new Schedule({ ...props, id: ulid() });

  static from = (props: ScheduleProps): Schedule => new Schedule(props);
}
