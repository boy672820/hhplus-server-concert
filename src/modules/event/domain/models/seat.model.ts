import { SeatStatus } from '@lib/types';
import { ulid } from 'ulid';

export interface SeatProps {
  id: string;
  eventId: string;
  number: number;
  status: SeatStatus;
}

export class Seat implements SeatProps {
  id: string;
  eventId: string;
  number: number;
  status: SeatStatus;

  private constructor(props: SeatProps) {
    Object.assign(this, props);
  }

  static create = (props: Pick<SeatProps, 'eventId' | 'number'>): Seat =>
    new Seat({ ...props, id: ulid(), status: SeatStatus.Pending });

  static from = (props: SeatProps): Seat => new Seat(props);
}
