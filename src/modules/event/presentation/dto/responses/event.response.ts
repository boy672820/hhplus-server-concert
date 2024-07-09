import { Exclude, Expose } from 'class-transformer';
import { Event } from '../../../domain/models';

interface Props {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  createdDate: string;
  updatedDate: string;
}

export class EventResponse implements Props {
  @Exclude()
  private _id: string;
  @Exclude()
  private _title: string;
  @Exclude()
  private _startDate: string;
  @Exclude()
  private _endDate: string;
  @Exclude()
  private _createdDate: string;
  @Exclude()
  private _updatedDate: string;

  @Expose()
  get id() {
    return this._id;
  }
  @Expose()
  get title() {
    return this._title;
  }
  @Expose()
  get startDate() {
    return this._startDate;
  }
  @Expose()
  get endDate() {
    return this._endDate;
  }
  @Expose()
  get createdDate() {
    return this._createdDate;
  }
  @Expose()
  get updatedDate() {
    return this._updatedDate;
  }

  private constructor(props: Props) {
    this._id = props.id;
    this._title = props.title;
    this._startDate = props.startDate;
    this._endDate = props.endDate;
    this._createdDate = props.createdDate;
    this._updatedDate = props.updatedDate;
  }

  static from = (props: Props) => new EventResponse(props);

  static fromModel = (model: Event) =>
    EventResponse.from({
      id: model.id,
      title: model.title,
      startDate: model.startDate.toString(),
      endDate: model.endDate.toString(),
      createdDate: model.createdDate.toString(),
      updatedDate: model.updatedDate.toString(),
    });
}
