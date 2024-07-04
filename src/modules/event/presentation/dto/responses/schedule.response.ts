import { Exclude, Expose } from 'class-transformer';

interface Props {
  id: string;
  date: string;
}

export class ScheduleResponse implements Props {
  @Exclude()
  private _id: string;
  @Exclude()
  private _date: string;

  @Expose()
  get id() {
    return this._id;
  }
  @Expose()
  get date() {
    return this._date;
  }

  private constructor(props: Props) {
    this._id = props.id;
    this._date = props.date;
  }

  static of = (props: Props) => new ScheduleResponse(props);
}
