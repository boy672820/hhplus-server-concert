import { SeatStatus } from '@libs/domain/types';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  VersionColumn,
} from 'typeorm';
import Decimal from 'decimal.js';
import { ScheduleEntity } from './schedule.entity';
import { ColumnMoney, ColumnUlid, PrimaryUlid } from '../decorators';

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
@Index(['schedule', 'status'])
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

  @ColumnUlid()
  scheduleId: string;

  @ManyToOne(() => ScheduleEntity, {
    eager: true,
    nullable: false,
    cascade: true,
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
