import { LocalDateTime } from '@lib/types';
import Decimal from 'decimal.js';

interface Props {
  userId: string;
  balance: Decimal;
  updatedDate: LocalDateTime;
}

export class UserPoint implements Props {
  userId: string;
  balance: Decimal;
  updatedDate: LocalDateTime;

  private constructor(props: Props) {
    Object.assign(this, props);
  }

  static from = (props: Props): UserPoint => new UserPoint(props);

  pay(amount: Decimal): void {
    if (this.balance.lt(amount)) {
      throw new Error('포인트가 부족합니다.');
    }

    this.balance = this.balance.minus(amount);
  }
}
