import { LocalDateTime, ScheduleStatus } from '@libs/domain/types';
import {
  EventEntity,
  ScheduleEntity,
  SeatEntity,
} from '@libs/database/entities';
import { faker } from '@faker-js/faker';
import { LocalDate, LocalTime } from '@js-joda/core';
import { ulid } from 'ulid';
import Decimal from 'decimal.js';
import { randomInt } from 'crypto';

const now = LocalDateTime.now();
const localDate = LocalDate.now();
const startTime = LocalTime.of(9, 0, 0);
const endTime = LocalTime.of(18, 0, 0);

const eventStartDate = LocalDateTime.of(
  LocalDate.of(localDate.year(), localDate.month(), 1),
  startTime,
);
const eventEndDate = LocalDateTime.of(
  LocalDate.of(localDate.year(), localDate.month(), 29),
  endTime,
);

const createStartDate = (): LocalDateTime =>
  LocalDateTime.of(
    LocalDate.of(localDate.year(), localDate.month(), 1),
    startTime,
  );

const createEndDate = (): LocalDateTime =>
  LocalDateTime.of(
    LocalDate.of(localDate.year(), localDate.month(), 1).plusMonths(1),
    endTime,
  );

const createEvent = (): EventEntity =>
  EventEntity.of({
    id: ulid(),
    title: faker.lorem.words(),
    address: faker.location.streetAddress(),
    startDate: eventStartDate,
    endDate: eventEndDate,
    createdDate: now,
    updatedDate: now,
  });

const scheduleStatusValues = Object.values(ScheduleStatus);
const createScheduleForRandomStatus = (event: EventEntity): ScheduleEntity =>
  ScheduleEntity.of({
    id: ulid(),
    startDate: createStartDate(),
    endDate: createEndDate(),
    event: event,
    status: scheduleStatusValues[randomInt(0, scheduleStatusValues.length - 1)],
  });

const createSeat = (
  schedule: ScheduleEntity,
  number: number,
  price: Decimal,
): SeatEntity =>
  SeatEntity.of({
    id: ulid(),
    eventId: schedule.event.id,
    number,
    schedule,
    price,
  });

// 인터파크의 총 상품 수는 278개입니다. (2024.07.31 기준)
export const events: EventEntity[] = Array.from({ length: 300 }, () =>
  createEvent(),
);

export const schedules: ScheduleEntity[] = events.flatMap((event) =>
  Array.from({ length: 5 }, () => createScheduleForRandomStatus(event)),
);

export const seats: SeatEntity[] = schedules.flatMap((schedule) =>
  Array.from({ length: 10 }, (_, i) =>
    createSeat(schedule, i + 1, new Decimal(10000)),
  ),
);
