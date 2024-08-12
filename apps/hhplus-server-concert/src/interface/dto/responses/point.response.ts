import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Point } from '../../../domain/models';

interface Props {
  balance: string;
}

export class PointResponse implements Props {
  @Exclude()
  private _balance: string;

  @ApiProperty({
    description: '포인트 잔액',
    example: '100000',
    type: String,
  })
  @Expose()
  get balance() {
    return this._balance;
  }

  private constructor(props: Props) {
    this._balance = props.balance;
  }

  static of = (props: Props): PointResponse => new PointResponse(props);
  static fromModel = (entity: Point): PointResponse =>
    new PointResponse({ balance: entity.balance.toString() });
}
