import { DataSource } from 'typeorm';
import { ulid } from 'ulid';
import Decimal from 'decimal.js';
import {
  LocalDateTime,
  ReservationStatus,
  SeatStatus,
} from '@libs/domain/types';
import {
  ReservationEntity,
  ReservationDetailEntity,
} from '@libs/database/entities';
import { SeatEntity } from '@libs/database/entities';
import { EventEntity } from '@libs/database/entities';
import { ScheduleEntity } from '@libs/database/entities';

let id = 0;

export const seedReservation = async ({
  dataSource,
  userId,
}: {
  dataSource: DataSource;
  userId: string;
}) => {
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

  const reservation = new ReservationEntity();
  reservation.id = '1';
  reservation.userId = userId;
  reservation.eventId = '1';
  reservation.seatNumber = seat.number;
  reservation.price = seat.price;
  reservation.status = ReservationStatus.TempAssigned;
  reservation.scheduleStartDate = LocalDateTime.now();
  reservation.scheduleEndDate = LocalDateTime.now();
  reservation.createdDate = LocalDateTime.now();
  reservation.expiresDate = LocalDateTime.now();
  reservation.detail = new ReservationDetailEntity();
  reservation.detail.id = '1';
  reservation.detail.eventTitle = 'Event Title';
  reservation.detail.eventAddress = 'Event Address';
  reservation.detail.eventStartDate = LocalDateTime.now();
  reservation.detail.eventEndDate = LocalDateTime.now();
  reservation.seat = seat;

  await dataSource.manager.save(reservation);

  return reservation;
};
