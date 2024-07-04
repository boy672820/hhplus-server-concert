import { Exclude, Expose } from 'class-transformer';

interface Props {
  balance: string;
}

export class PointResponse implements Props {
  @Exclude()
  private _balance: string;

  @Expose()
  get balance() {
    return this._balance;
  }

  private constructor(props: Props) {
    this._balance = props.balance;
  }

  static of = (props: Props): PointResponse => new PointResponse(props);
}
