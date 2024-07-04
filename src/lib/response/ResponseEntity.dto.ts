import { Exclude, Expose } from 'class-transformer';

export enum ResponseStatus {
  OK = 'OK',
  SERVER_ERROR = 'SERVER_ERROR',
  BAD_PARAMETER = 'BAD_PARAMETER',
}

export class ResponseEntity<T> {
  @Exclude()
  private _data: T;

  @Exclude()
  private _message: string;

  @Exclude()
  private _status: string;

  @Expose()
  get data() {
    return this._data;
  }

  @Expose()
  get message() {
    return this._message;
  }

  @Expose()
  get status() {
    return this._status;
  }

  private constructor(
    status: string = ResponseStatus.OK,
    message: string,
    data: T,
  ) {
    this._status = status;
    this._message = message;
    this._data = data;
  }

  static okWith<T>(data: T): ResponseEntity<T> {
    return new ResponseEntity('', '', data);
  }
}
