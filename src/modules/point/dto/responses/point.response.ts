import { Exclude, Expose } from 'class-transformer';
import { PointEntity } from '../../point.entity';
import { ApiProperty } from '@nestjs/swagger';

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
  static from = (entity: PointEntity): PointResponse =>
    new PointResponse({ balance: entity.balance.toString() });
}
