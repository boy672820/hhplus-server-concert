import { LocalDateTime } from '@libs/domain/types';
import { Column, Entity } from 'typeorm';
import { ColumnDatetime, PrimaryUlid } from '../decorators';

interface Event {
  id: string;
  title: string;
  address: string;
  startDate: LocalDateTime;
  endDate: LocalDateTime;
  createdDate: LocalDateTime;
  updatedDate: LocalDateTime;
}

@Entity('event')
export class EventEntity implements Event {
  @PrimaryUlid()
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  address: string;

  @ColumnDatetime()
  startDate: LocalDateTime;

  @ColumnDatetime()
  endDate: LocalDateTime;

  @ColumnDatetime()
  createdDate: LocalDateTime;

  @ColumnDatetime()
  updatedDate: LocalDateTime;

  static of(props: Event): EventEntity {
    const entity = new EventEntity();
    Object.assign(entity, props);
    return entity;
  }
}
