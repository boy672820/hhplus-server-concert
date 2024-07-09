import { LocalDateTime } from '../../src/lib/types';
import { faker } from '@faker-js/faker';
import { LocalDate, LocalTime } from '@js-joda/core';
import { ulid } from 'ulid';
import { EventEntity } from '../../src/modules/event/infra/entities/event.entity';
import { ScheduleEntity } from '../../src/modules/event/infra/entities/schedule.entity';
import { SeatEntity } from '../../src/modules/event/infra/entities/seat.entity';

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

const createStartDate = (added: number = 0): LocalDateTime =>
  LocalDateTime.of(
    LocalDate.of(
      localDate.year(),
      localDate.month(),
      localDate.dayOfMonth() + added,
    ),
    startTime,
  );

const createEndDate = (added: number = 0): LocalDateTime =>
  LocalDateTime.of(
    LocalDate.of(
      localDate.year(),
      localDate.month(),
      localDate.dayOfMonth() + added,
    ),
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

const createSchedule = (
  event: EventEntity,
  added: number = 0,
): ScheduleEntity =>
  ScheduleEntity.of({
    id: ulid(),
    startDate: createStartDate(added),
    endDate: createEndDate(added),
    event: event,
  });

const createSeat = (schedule: ScheduleEntity, number: number): SeatEntity =>
  SeatEntity.of({
    id: ulid(),
    number,
    schedule,
  });

export const events: EventEntity[] = Array.from({ length: 5 }, () =>
  createEvent(),
);

export const schedules: ScheduleEntity[] = events.flatMap((event) =>
  Array.from({ length: 5 }, (_, j) => createSchedule(event, j)),
);

export const seats: SeatEntity[] = schedules.flatMap((schedule) =>
  Array.from({ length: 10 }, (_, i) => createSeat(schedule, i + 1)),
);
