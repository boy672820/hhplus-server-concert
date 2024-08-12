import { SeatStatus } from '@libs/domain/types';
import { Exclude, Expose } from 'class-transformer';
import { Seat } from '../../../domain/models';
import { ApiProperty } from '@nestjs/swagger';

interface Props {
  id: string;
  number: number;
  status: SeatStatus;
}

export class SeatResponse implements Props {
  @Exclude()
  private _id: string;
  @Exclude()
  private _number: number;
  @Exclude()
  private _status: SeatStatus;

  @ApiProperty({
    description: '좌석 ID',
    example: '1',
  })
  @Expose()
  get id(): string {
    return this._id;
  }

  @ApiProperty({
    description: '좌석 번호',
    example: 1,
  })
  @Expose()
  get number(): number {
    return this._number;
  }

  @ApiProperty({
    description: '좌석 상태',
    enum: SeatStatus,
    example: SeatStatus.Pending,
  })
  @Expose()
  get status(): SeatStatus {
    return this._status;
  }

  private constructor(props: Props) {
    this._id = props.id;
    this._number = props.number;
    this._status = props.status;
  }

  static of = (props: Props) => new SeatResponse(props);

  static fromModel = (model: Seat) =>
    new SeatResponse({
      id: model.id,
      number: model.number,
      status: model.status,
    });
}
