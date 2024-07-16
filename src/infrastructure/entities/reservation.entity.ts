import { LocalDateTime, ReservationStatus } from '@lib/types';
import {
  ColumnDatetime,
  ColumnMoney,
  ColumnUlid,
  PrimaryUlid,
} from '@lib/decorators';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { SeatEntity } from './seat.entity';
import { ReservationDetailEntity } from './reservation-detail.entity';
import Decimal from 'decimal.js';

@Entity('reservation')
export class ReservationEntity {
  @PrimaryUlid()
  id: string;

  @ColumnUlid()
  userId: string;

  @ColumnUlid()
  eventId: string;

  @Column({ type: 'int', nullable: false })
  seatNumber: number;

  @ColumnMoney()
  price: Decimal;

  @Column({ type: 'enum', enum: ReservationStatus })
  status: ReservationStatus;

  @ColumnDatetime()
  scheduleStartDate: LocalDateTime;

  @ColumnDatetime()
  scheduleEndDate: LocalDateTime;

  @ColumnDatetime()
  createdDate: LocalDateTime;

  @ColumnDatetime({ nullable: true })
  expiresDate: LocalDateTime | null;

  @OneToOne(() => SeatEntity, { cascade: true, nullable: false, eager: true })
  @JoinColumn({ name: 'seatId' })
  seat: SeatEntity;

  @OneToOne(() => ReservationDetailEntity, {
    cascade: true,
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'reservationDetailId' })
  detail: ReservationDetailEntity;
}
