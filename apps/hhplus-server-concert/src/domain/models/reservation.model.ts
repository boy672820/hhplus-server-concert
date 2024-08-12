import { LocalDateTime, ReservationStatus } from '@libs/domain/types';
import { DomainError } from '../../lib/errors';
import Decimal from 'decimal.js';
import { ulid } from 'ulid';
import { AggregateRoot } from '@nestjs/cqrs';
import { ReservationPaidEvent, ReservationReservedSeatEvent } from '../events';

export interface ReservationProps {
  id: string;
  userId: string;
  eventId: string;
  eventTitle: string;
  eventAddress: string;
  eventStartDate: LocalDateTime;
  eventEndDate: LocalDateTime;
  reservationDetailId: string;
  seatId: string;
  seatNumber: number;
  price: Decimal;
  status: ReservationStatus;
  scheduleStartDate: LocalDateTime;
  scheduleEndDate: LocalDateTime;
  expiresDate: LocalDateTime | null;
  createdDate: LocalDateTime;
}

export type ReservationCreateProps = Pick<
  ReservationProps,
  | 'userId'
  | 'eventId'
  | 'eventTitle'
  | 'eventAddress'
  | 'eventStartDate'
  | 'eventEndDate'
  | 'seatId'
  | 'seatNumber'
  | 'price'
  | 'scheduleStartDate'
  | 'scheduleEndDate'
>;

export class Reservation extends AggregateRoot implements ReservationProps {
  id: string;
  userId: string;
  eventId: string;
  eventTitle: string;
  eventAddress: string;
  eventStartDate: LocalDateTime;
  eventEndDate: LocalDateTime;
  reservationDetailId: string;
  seatId: string;
  seatNumber: number;
  price: Decimal;
  status: ReservationStatus;
  scheduleStartDate: LocalDateTime;
  scheduleEndDate: LocalDateTime;
  expiresDate: LocalDateTime | null;
  createdDate: LocalDateTime;

  private constructor(props: ReservationProps) {
    super();
    Object.assign(this, props);
  }

  static create = (props: ReservationCreateProps): Reservation =>
    new Reservation({
      ...props,
      id: ulid(),
      reservationDetailId: ulid(),
      status: ReservationStatus.TempAssigned,
      expiresDate: LocalDateTime.now().plusMinutes(5),
      createdDate: LocalDateTime.now(),
    });

  static from = (props: ReservationProps): Reservation =>
    new Reservation(props);

  reserveSeat(seatId: string): void {
    this.apply(new ReservationReservedSeatEvent(seatId, this.id));
  }

  pay(userId: string): void {
    if (this.status === ReservationStatus.Paid) {
      throw DomainError.conflict('이미 결제된 예약입니다.');
    }

    if (this.userId !== userId) {
      throw DomainError.forbidden('다른 사용자의 예약은 결제할 수 없습니다.');
    }

    this.status = ReservationStatus.Paid;

    this.apply(
      new ReservationPaidEvent(this.id, this.seatId, this.price.toString()),
    );
  }
}
