import { LocalDateTime } from '@lib/types';
import { ColumnDatetime, PrimaryUlid } from '@lib/decorators';
import { Column, Entity } from 'typeorm';

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
