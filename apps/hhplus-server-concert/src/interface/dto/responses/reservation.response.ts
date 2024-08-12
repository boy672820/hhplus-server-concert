import { LocalDateTime, ReservationStatus } from '@libs/domain/types';
import { Exclude, Expose } from 'class-transformer';
import { Reservation } from '../../../domain/models';
import { ApiProperty } from '@nestjs/swagger';

interface Props {
  id: string;
  eventId: string;
  seatId: string;
  seatNumber: number;
  status: ReservationStatus;
  scheduleStartDate: LocalDateTime;
  scheduleEndDate: LocalDateTime;
  expiresDate: LocalDateTime | null;
  createdDate: LocalDateTime;
}

export class ReservationResponse implements Props {
  @Exclude()
  private _id: string;
  @Exclude()
  private _eventId: string;
  @Exclude()
  private _seatId: string;
  @Exclude()
  private _seatNumber: number;
  @Exclude()
  private _status: ReservationStatus;
  @Exclude()
  private _scheduleStartDate: LocalDateTime;
  @Exclude()
  private _scheduleEndDate: LocalDateTime;
  @Exclude()
  private _expiresDate: LocalDateTime | null;
  @Exclude()
  private _createdDate: LocalDateTime;

  @ApiProperty({
    description: '예약 ID',
    example: '1',
  })
  @Expose()
  get id() {
    return this._id;
  }

  @ApiProperty({
    description: '이벤트 ID',
    example: '1',
  })
  @Expose()
  get eventId() {
    return this._eventId;
  }

  @ApiProperty({
    description: '좌석 ID',
    example: '1',
  })
  @Expose()
  get seatId() {
    return this._seatId;
  }

  @ApiProperty({
    description: '좌석 번호',
    example: 1,
  })
  @Expose()
  get seatNumber() {
    return this._seatNumber;
  }

  @ApiProperty({
    description: '예약 상태',
    enum: ReservationStatus,
  })
  @Expose()
  get status() {
    return this._status;
  }

  @ApiProperty({
    description: '일정 시작 일시',
    example: '2021-07-01T00:00:00',
  })
  @Expose()
  get scheduleStartDate() {
    return this._scheduleStartDate;
  }

  @ApiProperty({
    description: '일정 종료 일시',
    example: '2021-07-01T00:00:00',
  })
  @Expose()
  get scheduleEndDate() {
    return this._scheduleEndDate;
  }

  @ApiProperty({
    description: '만료 일시',
    example: '2021-07-01T00:00:00',
  })
  @Expose()
  get expiresDate() {
    return this._expiresDate;
  }

  @ApiProperty({
    description: '생성 일시',
    example: '2021-07-01T00:00:00',
  })
  @Expose()
  get createdDate() {
    return this._createdDate;
  }

  private constructor(props: Props) {
    this._id = props.id;
    this._eventId = props.eventId;
    this._seatId = props.seatId;
    this._seatNumber = props.seatNumber;
    this._status = props.status;
    this._scheduleStartDate = props.scheduleStartDate;
    this._scheduleEndDate = props.scheduleEndDate;
    this._expiresDate = props.expiresDate;
    this._createdDate = props.createdDate;
  }

  static of = (props: Props): ReservationResponse =>
    new ReservationResponse(props);

  static fromModel = (reservation: Reservation): ReservationResponse =>
    new ReservationResponse({
      id: reservation.id,
      eventId: reservation.eventId,
      seatId: reservation.seatId,
      seatNumber: reservation.seatNumber,
      status: reservation.status,
      scheduleStartDate: reservation.scheduleStartDate,
      scheduleEndDate: reservation.scheduleEndDate,
      expiresDate: reservation.expiresDate,
      createdDate: reservation.createdDate,
    });
}
