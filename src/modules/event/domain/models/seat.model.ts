import { LocalDateTime, SeatStatus } from '@lib/types';
import { DomainError } from '@lib/errors';
import { ulid } from 'ulid';
import Decimal from 'decimal.js';

export interface SeatProps {
  id: string;
  eventId: string;
  scheduleId: string;
  scheduleStartDate: LocalDateTime;
  scheduleEndDate: LocalDateTime;
  number: number;
  status: SeatStatus;
  price: Decimal;
}

export class Seat implements SeatProps {
  id: string;
  eventId: string;
  scheduleId: string;
  scheduleStartDate: LocalDateTime;
  scheduleEndDate: LocalDateTime;
  number: number;
  status: SeatStatus;
  price: Decimal;

  private constructor(props: SeatProps) {
    Object.assign(this, props);
  }

  static create = (
    props: Pick<
      SeatProps,
      | 'scheduleId'
      | 'scheduleStartDate'
      | 'scheduleEndDate'
      | 'eventId'
      | 'number'
      | 'price'
    >,
  ): Seat => new Seat({ ...props, id: ulid(), status: SeatStatus.Pending });

  static from = (props: SeatProps): Seat => new Seat(props);

  isNotAvailable = (): boolean => this.status !== SeatStatus.Pending;

  temporarilyReserve = (): void => {
    if (this.isNotAvailable()) {
      throw DomainError.conflict('이미 예약된 좌석입니다.');
    }

    this.status = SeatStatus.InProgress;
  };
}
