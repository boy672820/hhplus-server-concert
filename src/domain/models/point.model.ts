import Decimal from 'decimal.js';

interface Props {
  userId: string;
  balance: Decimal;
  updatedDate: Date;
}

export class Point implements Props {
  userId: string;
  balance: Decimal;
  updatedDate: Date;

  private constructor(props: Props) {
    Object.assign(this, props);
  }

  static from = (props: Props): Point => new Point(props);

  static create = (userId: string): Point =>
    new Point({
      userId,
      balance: new Decimal(0),
      updatedDate: new Date(),
    });

  pay(amount: Decimal): void {
    if (this.balance.lt(amount)) {
      throw new Error('포인트가 부족합니다.');
    }

    this.balance = this.balance.minus(amount);
    this.updatedDate = new Date();
  }
}
