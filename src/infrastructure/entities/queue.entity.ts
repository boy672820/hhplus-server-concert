import { LocalDateTime, QueueStatus } from '@lib/types';
import { ColumnDatetime, ColumnUlid } from '@lib/decorators';
import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

export interface Queue {
  sequence: number;
  userId: string;
  status: QueueStatus;
  expiresDate: LocalDateTime;
}

@Entity('queue')
export class QueueEntity implements Queue {
  @PrimaryGeneratedColumn('increment')
  sequence: number;

  @ColumnUlid()
  @Index()
  userId: string;

  @Column({ type: 'enum', enum: QueueStatus, default: QueueStatus.Waiting })
  status: QueueStatus;

  @ColumnDatetime()
  expiresDate: LocalDateTime;
}
