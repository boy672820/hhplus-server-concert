import { LocalDateTime, ReservationStatus } from '@lib/types';
import { DomainError } from '@lib/errors';
import Decimal from 'decimal.js';
import { ulid } from 'ulid';

interface Props {
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

export class Reservation implements Props {
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

  private constructor(props: Props) {
    Object.assign(this, props);
  }

  static create = (
    props: Pick<
      Props,
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
    >,
  ): Reservation =>
    new Reservation({
      ...props,
      id: ulid(),
      reservationDetailId: ulid(),
      status: ReservationStatus.TempAssigned,
      expiresDate: LocalDateTime.now().plusMinutes(5),
      createdDate: LocalDateTime.now(),
    });

  static from = (props: Props): Reservation => new Reservation(props);

  pay(userId: string): void {
    if (this.status === ReservationStatus.Paid) {
      throw DomainError.conflict('이미 결제된 예약입니다.');
    }

    if (this.userId !== userId) {
      throw DomainError.forbidden('다른 사용자의 예약은 결제할 수 없습니다.');
    }

    this.status = ReservationStatus.Paid;
  }
}
