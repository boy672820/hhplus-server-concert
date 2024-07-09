import { LocalDateTime } from '@lib/types';
import { ColumnDatetime, PrimaryUlid } from '@lib/decorators';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { EventEntity } from './event.entity';

interface Schedule {
  id: string;
  startDate: LocalDateTime;
  endDate: LocalDateTime;
  event: EventEntity;
}

@Entity('schedule')
export class ScheduleEntity {
  @PrimaryUlid()
  id: string;

  @ColumnDatetime()
  startDate: LocalDateTime;

  @ColumnDatetime()
  endDate: LocalDateTime;

  @ManyToOne(() => EventEntity, { cascade: true, nullable: false })
  @JoinColumn({ name: 'eventId' })
  event: EventEntity;

  static of(props: Schedule): ScheduleEntity {
    const entity = new ScheduleEntity();
    Object.assign(entity, props);
    return entity;
  }
}
