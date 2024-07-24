import { SeatStatus } from '@lib/types';
import { ColumnMoney, ColumnUlid, PrimaryUlid } from '@lib/decorators';
import { Column, Entity, JoinColumn, ManyToOne, VersionColumn } from 'typeorm';
import Decimal from 'decimal.js';
import { ScheduleEntity } from './schedule.entity';

interface Seat {
  id: string;
  number: number;
  status: SeatStatus;
  eventId: string;
  schedule: ScheduleEntity;
  price: Decimal;
  version: number;
}

@Entity('seat')
export class SeatEntity implements Seat {
  @PrimaryUlid()
  id: string;

  @ColumnUlid()
  eventId: string;

  @Column({ type: 'int', nullable: false })
  number: number;

  @Column({ type: 'enum', enum: SeatStatus, default: SeatStatus.Pending })
  status: SeatStatus;

  @ColumnMoney()
  price: Decimal;

  @ManyToOne(() => ScheduleEntity, {
    nullable: false,
    cascade: true,
    eager: true,
  })
  @JoinColumn({ name: 'scheduleId' })
  schedule: ScheduleEntity;

  @VersionColumn()
  version: number;

  static of(
    props: Pick<Seat, 'id' | 'eventId' | 'number' | 'schedule' | 'price'>,
  ): SeatEntity {
    const entity = new SeatEntity();
    Object.assign(entity, props);
    entity.status = SeatStatus.Pending;
    return entity;
  }
}
