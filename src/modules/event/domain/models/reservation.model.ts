import { LocalDateTime, ReservationStatus } from '@lib/types';
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
}
