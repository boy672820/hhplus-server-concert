import { LocalDateTime } from '@lib/types';
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
  updatedDate: LocalDateTime;

  equals(other: PointEntity): boolean {
    return this.userId === other.userId && this.balance.eq(other.balance);
  }
}
