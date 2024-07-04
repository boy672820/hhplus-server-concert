import { Exclude, Expose } from 'class-transformer';

interface Props {
  reservationId: string;
  amount: string;
  createdDate: Date;
}

export class PaymentResponse implements Props {
  @Exclude()
  private _reservationId: string;
  @Exclude()
  private _amount: string;
  @Exclude()
  private _createdDate: Date;

  @Expose()
  get reservationId() {
    return this._reservationId;
  }
  @Expose()
  get amount() {
    return this._amount;
  }
  @Expose()
  get createdDate() {
    return this._createdDate;
  }

  private constructor(props: Props) {
    this._reservationId = props.reservationId;
    this._amount = props.amount;
    this._createdDate = props.createdDate;
  }

  static of = (props: Props): PaymentResponse => new PaymentResponse(props);
}
