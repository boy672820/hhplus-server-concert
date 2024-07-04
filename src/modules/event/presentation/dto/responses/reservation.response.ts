import { ReservationStatus } from '@lib/types';
import { Exclude, Expose } from 'class-transformer';

type Event = {
  id: string;
  title: string;
  address: string;
  startDate: string;
  endDate: string;
};

interface Props {
  id: string;
  scheduleDate: string;
  seatNumber: number;
  status: ReservationStatus;
  event: Event;
  reservedDate: Date;
  expiredDate: Date;
}

export class ReservationResponse implements Props {
  @Exclude()
  private _id: string;
  @Exclude()
  private _scheduleDate: string;
  @Exclude()
  private _seatNumber: number;
  @Exclude()
  private _status: ReservationStatus;
  @Exclude()
  private _event: Event;
  @Exclude()
  private _reservedDate: Date;
  @Exclude()
  private _expiredDate: Date;

  @Expose()
  get id() {
    return this._id;
  }
  @Expose()
  get scheduleDate() {
    return this._scheduleDate;
  }
  @Expose()
  get seatNumber() {
    return this._seatNumber;
  }
  @Expose()
  get status() {
    return this._status;
  }
  @Expose()
  get event() {
    return this._event;
  }
  @Expose()
  get reservedDate() {
    return this._reservedDate;
  }
  @Expose()
  get expiredDate() {
    return this._expiredDate;
  }

  private constructor(props: Props) {
    this._id = props.id;
    this._scheduleDate = props.scheduleDate;
    this._seatNumber = props.seatNumber;
    this._status = props.status;
    this._event = props.event;
    this._reservedDate = props.reservedDate;
    this._expiredDate = props.expiredDate;
  }

  static of = (props: Props): ReservationResponse =>
    new ReservationResponse(props);
}
