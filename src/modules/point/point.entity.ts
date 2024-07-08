import { ColumnDatetime, ColumnMoney, PrimaryUlid } from '@lib/decorators';
import { Entity } from 'typeorm';
import Decimal from 'decimal.js';

@Entity('point')
export class PointEntity {
  @PrimaryUlid()
  userId: string;

  @ColumnMoney()
  balance: Decimal;

  @ColumnDatetime()
  updatedDate: Date;

  static of({
    userId,
    balance,
    updatedDate,
  }: {
    userId: string;
    balance: string;
    updatedDate: Date;
  }): PointEntity {
    const entity = new PointEntity();
    entity.userId = userId;
    entity.balance = new Decimal(balance);
    entity.updatedDate = updatedDate;
    return entity;
  }

  equals(other: PointEntity): boolean {
    return this.userId === other.userId && this.balance.eq(other.balance);
  }
}
