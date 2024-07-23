import { LocalDateTime, SeatStatus } from '../types';
import { DataSource } from 'typeorm';
import Decimal from 'decimal.js';
import { ulid } from 'ulid';
import { EventEntity } from '../../infrastructure/entities/event.entity';
import { ScheduleEntity } from '../../infrastructure/entities/schedule.entity';
import { SeatEntity } from '../../infrastructure/entities/seat.entity';

let id = 0;

export const seedSeat = async ({
  dataSource,
}: {
  dataSource: DataSource;
}): Promise<SeatEntity> => {
  const event = new EventEntity();
  event.id = ulid();
  event.title = 'Test Event';
  event.address = 'Test Address';
  event.startDate = LocalDateTime.now();
  event.endDate = LocalDateTime.now();
  event.createdDate = LocalDateTime.now();
  event.updatedDate = LocalDateTime.now();

  const schedule = new ScheduleEntity();
  schedule.id = ulid();
  schedule.event = event;
  schedule.startDate = LocalDateTime.now().minusMinutes(30);
  schedule.endDate = LocalDateTime.now().plusMinutes(30);

  const seat = new SeatEntity();
  seat.id = ulid();
  seat.eventId = event.id;
  seat.number = id++;
  seat.status = SeatStatus.Pending;
  seat.price = new Decimal(10_000);
  seat.schedule = schedule;

  await dataSource.manager.save(seat);

  return seat;
};
