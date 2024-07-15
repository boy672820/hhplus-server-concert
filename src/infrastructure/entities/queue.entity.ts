import { LocalDateTime } from '@lib/types';
import { ColumnDatetime, ColumnUlid } from '@lib/decorators';
import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

export interface Queue {
  sequence: number;
  userId: string;
  isAvailable: boolean;
  expiresDate: LocalDateTime;
}

@Entity('queue')
export class QueueEntity implements Queue {
  @PrimaryGeneratedColumn('increment')
  sequence: number;

  @ColumnUlid()
  @Index()
  userId: string;

  @Column({ type: 'bool', default: false })
  isAvailable: boolean;

  @ColumnDatetime()
  expiresDate: LocalDateTime;
}
