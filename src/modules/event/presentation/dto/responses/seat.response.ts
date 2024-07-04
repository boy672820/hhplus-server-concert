import { SeatStatus } from '@lib/types';
import { Exclude, Expose } from 'class-transformer';

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

  @Expose()
  get id(): string {
    return this._id;
  }
  @Expose()
  get number(): number {
    return this._number;
  }
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
}
