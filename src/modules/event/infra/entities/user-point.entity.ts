import { LocalDateTime } from '@lib/types';
import { ColumnDatetime, ColumnMoney, PrimaryUlid } from '@lib/decorators';
import { Entity } from 'typeorm';
import Decimal from 'decimal.js';

@Entity('point')
export class UserPointEntity {
  @PrimaryUlid()
  userId: string;

  @ColumnMoney()
  balance: Decimal;

  @ColumnDatetime()
  updatedDate: LocalDateTime;
}
