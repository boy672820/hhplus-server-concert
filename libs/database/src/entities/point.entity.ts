import { LocalDateTime } from '@libs/domain/types';
import { Entity } from 'typeorm';
import Decimal from 'decimal.js';
import { ColumnDatetime, ColumnMoney, PrimaryUlid } from '../decorators';

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
