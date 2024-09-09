import { AggregateRoot } from '@nestjs/cqrs';
import { SeatStatus } from '@libs/domain/types';
import { DomainError } from '@libs/common/errors';
import { ulid } from 'ulid';
import Decimal from 'decimal.js';
import { SeatReservedEvent } from '../events';

export interface SeatProps {
  id: string;
  eventId: string;
  scheduleId: string;
  number: number;
  status: SeatStatus;
  price: Decimal;
  version: number;
}

export type SeatCreateProps = Pick<
  SeatProps,
  'scheduleId' | 'eventId' | 'number' | 'price'
>;

export class Seat extends AggregateRoot implements SeatProps {
  id: string;
  eventId: string;
  scheduleId: string;
  number: number;
  status: SeatStatus;
  price: Decimal;
  version: number;

  private constructor(props: SeatProps) {
    super();
    Object.assign(this, props);
  }

  static create = (props: SeatCreateProps): Seat =>
    new Seat({ ...props, id: ulid(), status: SeatStatus.Pending, version: 0 });

  static from = (props: SeatProps): Seat => new Seat(props);

  isNotAvailable = (): boolean => this.status !== SeatStatus.Pending;

  temporarilyReserve(reservationId: string): void {
    if (this.isNotAvailable()) {
      throw DomainError.conflict('이미 예약된 좌석입니다.');
    }

    this.status = SeatStatus.InProgress;
    this.apply(new SeatReservedEvent(this.id, reservationId));
  }

  pay(): void {
    if (this.status === SeatStatus.Completed) {
      throw DomainError.conflict('이미 결제된 좌석입니다.');
    }

    this.status = SeatStatus.Completed;
  }
}
