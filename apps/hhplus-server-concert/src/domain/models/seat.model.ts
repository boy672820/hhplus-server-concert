import { SeatStatus } from '@libs/domain/types';
import { DomainError } from '../../lib/errors';
import { ulid } from 'ulid';
import Decimal from 'decimal.js';

export interface SeatProps {
  id: string;
  eventId: string;
  scheduleId: string;
  number: number;
  status: SeatStatus;
  price: Decimal;
  version: number;
}

export class Seat implements SeatProps {
  id: string;
  eventId: string;
  scheduleId: string;
  number: number;
  status: SeatStatus;
  price: Decimal;
  version: number;

  private constructor(props: SeatProps) {
    Object.assign(this, props);
  }

  static create = (
    props: Pick<SeatProps, 'scheduleId' | 'eventId' | 'number' | 'price'>,
  ): Seat =>
    new Seat({ ...props, id: ulid(), status: SeatStatus.Pending, version: 0 });

  static from = (props: SeatProps): Seat => new Seat(props);

  isNotAvailable = (): boolean => this.status !== SeatStatus.Pending;

  temporarilyReserve = (): void => {
    if (this.isNotAvailable()) {
      throw DomainError.conflict('이미 예약된 좌석입니다.');
    }

    this.status = SeatStatus.InProgress;
  };

  pay(): void {
    if (this.status === SeatStatus.Completed) {
      throw DomainError.conflict('이미 결제된 좌석입니다.');
    }

    this.status = SeatStatus.Completed;
  }
}
