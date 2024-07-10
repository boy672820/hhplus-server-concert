import { Exclude, Expose } from 'class-transformer';
import { Schedule } from '../../../domain/models';
import { ApiProperty } from '@nestjs/swagger';

interface Props {
  id: string;
  startDate: string;
  endDate: string;
}

export class ScheduleResponse implements Props {
  @Exclude()
  private _id: string;
  @Exclude()
  private _startDate: string;
  @Exclude()
  private _endDate: string;

  @ApiProperty({
    description: '일정 ID',
    example: '1',
    type: String,
    format: 'ulid',
  })
  @Expose()
  get id() {
    return this._id;
  }

  @ApiProperty({
    description: '일정 시작 날짜',
    example: '2021-01-01T00:00:00',
    type: String,
    format: 'date-time',
  })
  @Expose()
  get startDate() {
    return this._startDate;
  }

  @ApiProperty({
    description: '일정 종료 날짜',
    example: '2021-01-23:59:59',
    type: String,
    format: 'date-time',
  })
  @Expose()
  get endDate() {
    return this._endDate;
  }

  private constructor(props: Props) {
    this._id = props.id;
    this._startDate = props.startDate;
    this._endDate = props.endDate;
  }

  static of = (props: Props) => new ScheduleResponse(props);

  static fromModel = (model: Schedule) =>
    ScheduleResponse.of({
      id: model.id,
      startDate: model.startDate.toString(),
      endDate: model.endDate.toString(),
    });
}
