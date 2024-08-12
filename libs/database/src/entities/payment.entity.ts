import { ColumnDatetime, ColumnMoney, PrimaryUlid } from '../decorators';
import { LocalDateTime } from '@libs/domain/types';
import Decimal from 'decimal.js';
import { Entity, JoinColumn, OneToOne } from 'typeorm';
import { ReservationEntity } from './reservation.entity';

@Entity('payment')
export class PaymentEntity {
  @PrimaryUlid()
  reservationId: string;

  @ColumnMoney()
  amount: Decimal;

  @ColumnDatetime()
  createdDate: LocalDateTime;

  @OneToOne(() => ReservationEntity, (reservation) => reservation, {
    cascade: true,
    nullable: false,
  })
  @JoinColumn({ name: 'reservationId' })
  reservation: ReservationEntity;
}
