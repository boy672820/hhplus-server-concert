import { LocalDateTime } from '@lib/types';
import { DomainError } from '@lib/errors';
import Decimal from 'decimal.js';

interface Props {
  userId: string;
  balance: Decimal;
  updatedDate: LocalDateTime;
}

export class Point implements Props {
  userId: string;
  balance: Decimal;
  updatedDate: LocalDateTime;

  private constructor(props: Props) {
    Object.assign(this, props);
  }

  static from = (props: Props): Point => new Point(props);

  static create = (userId: string): Point =>
    new Point({
      userId,
      balance: new Decimal(0),
      updatedDate: LocalDateTime.now(),
    });

  pay(amount: Decimal): void {
    if (this.balance.lt(amount)) {
      throw DomainError.limitExceeded('잔액이 부족합니다.');
    }

    this.balance = this.balance.minus(amount);
    this.updatedDate = LocalDateTime.now();
  }
}
