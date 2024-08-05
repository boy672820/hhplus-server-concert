import { LocalDateTime, ScheduleStatus } from '@lib/types';
import { ColumnDatetime, PrimaryUlid } from '@lib/decorators';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { EventEntity } from './event.entity';

interface Schedule {
  id: string;
  startDate: LocalDateTime;
  endDate: LocalDateTime;
  event: EventEntity;
}

@Entity('schedule')
@Index(['startDate', 'endDate', 'event', 'id'])
export class ScheduleEntity {
  @PrimaryUlid()
  id: string;

  @ColumnDatetime()
  startDate: LocalDateTime;

  @ColumnDatetime()
  endDate: LocalDateTime;

  @Column({
    type: 'enum',
    enum: ScheduleStatus,
    default: ScheduleStatus.Active,
  })
  status: ScheduleStatus;

  @ManyToOne(() => EventEntity, { cascade: true, nullable: false })
  @JoinColumn({ name: 'eventId' })
  event: EventEntity;

  static of(props: Schedule): ScheduleEntity {
    const entity = new ScheduleEntity();
    Object.assign(entity, props);
    return entity;
  }
}
