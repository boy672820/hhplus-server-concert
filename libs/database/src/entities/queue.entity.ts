import { LocalDateTime, QueueStatus } from '@libs/domain/types';
import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';
import { ColumnDatetime, ColumnUlid } from '../decorators';

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
