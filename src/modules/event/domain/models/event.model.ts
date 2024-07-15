import { LocalDateTime } from '@lib/types';
import { ulid } from 'ulid';

interface EventProps {
  id: string;
  title: string;
  address: string;
  startDate: LocalDateTime;
  endDate: LocalDateTime;
  createdDate: LocalDateTime;
  updatedDate: LocalDateTime;
}

export class Event implements EventProps {
  id: string;
  title: string;
  address: string;
  startDate: LocalDateTime;
  endDate: LocalDateTime;
  createdDate: LocalDateTime;
  updatedDate: LocalDateTime;

  private constructor(props: Event) {
    Object.assign(this, props);
  }

  static create = (
    props: Pick<EventProps, 'title' | 'address' | 'startDate' | 'endDate'>,
  ): Event =>
    new Event({
      ...props,
      id: ulid(),
      createdDate: LocalDateTime.now(),
      updatedDate: LocalDateTime.now(),
    });

  static from = (props: EventProps): Event => new Event(props);
}
