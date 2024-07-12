import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Payment } from '../../../domain/models';

interface Props {
  reservationId: string;
  amount: string;
  createdDate: string;
}

export class PaymentResponse implements Props {
  @Exclude()
  private _reservationId: string;
  @Exclude()
  private _amount: string;
  @Exclude()
  private _createdDate: string;

  @ApiProperty({
    description: '예약 ID',
    example: '1',
  })
  @Expose()
  get reservationId() {
    return this._reservationId;
  }

  @ApiProperty({
    description: '결제 금액',
    example: '10000',
  })
  @Expose()
  get amount() {
    return this._amount;
  }

  @ApiProperty({
    description: '결제 일자',
    example: '2021-10-01T00:00:00',
  })
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

  static fromModel = (payment: Payment): PaymentResponse =>
    PaymentResponse.of({
      reservationId: payment.reservationId,
      amount: payment.amount.toString(),
      createdDate: payment.createdDate.toString(),
    });
}
