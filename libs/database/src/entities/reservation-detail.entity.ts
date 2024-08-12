import { LocalDateTime } from '@libs/domain/types';
import { Column, Entity } from 'typeorm';
import { ColumnDatetime, PrimaryUlid } from '../decorators';

@Entity('reservationDetail')
export class ReservationDetailEntity {
  @PrimaryUlid()
  id: string;

  @Column({ type: 'varchar', length: 255 })
  eventTitle: string;

  @Column({ type: 'text' })
  eventAddress: string;

  @ColumnDatetime()
  eventStartDate: LocalDateTime;

  @ColumnDatetime()
  eventEndDate: LocalDateTime;
}
