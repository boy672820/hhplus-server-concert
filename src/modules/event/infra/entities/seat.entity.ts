import { SeatStatus } from '@lib/types';
import { PrimaryUlid } from '@lib/decorators';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ScheduleEntity } from './schedule.entity';

interface Seat {
  id: string;
  number: number;
  status: SeatStatus;
  schedule: ScheduleEntity;
}

@Entity('seat')
export class SeatEntity implements Seat {
  @PrimaryUlid()
  id: string;

  @Column({ type: 'int', nullable: false })
  number: number;

  @Column({ type: 'enum', enum: SeatStatus, default: SeatStatus.Pending })
  status: SeatStatus;

  @ManyToOne(() => ScheduleEntity, { nullable: false, cascade: true })
  @JoinColumn({ name: 'scheduleId' })
  schedule: ScheduleEntity;

  static of(props: Pick<Seat, 'id' | 'number' | 'schedule'>): SeatEntity {
    const entity = new SeatEntity();
    Object.assign(entity, props);
    entity.status = SeatStatus.Pending;
    return entity;
  }
}
