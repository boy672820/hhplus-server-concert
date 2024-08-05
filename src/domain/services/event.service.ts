import { LocalDateTime } from '@lib/types';
import { Injectable } from '@nestjs/common';
import {
  EventRepository,
  ScheduleRepository,
  SeatRepository,
} from '../repositories';
import { Event, Schedule, Seat } from '../models';

@Injectable()
export class EventService {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly scheduleRepository: ScheduleRepository,
    private readonly seatRepository: SeatRepository,
  ) {}

  async findAll(): Promise<Event[]> {
    const events = await this.eventRepository.findAll();
    return events;
  }

  async findSchedulesBetween({
    startDate,
    endDate,
  }: {
    startDate: LocalDateTime;
    endDate: LocalDateTime;
  }): Promise<Schedule[]> {
    return this.scheduleRepository.findBetween({ startDate, endDate });
  }

  async findSchedulesBetweenByEventId({
    eventId,
    between,
  }: {
    eventId: string;
    between: { startDate: LocalDateTime; endDate: LocalDateTime };
  }): Promise<Schedule[]> {
    return this.scheduleRepository.findBetweenByEventId(eventId, between);
  }

  async findAvailableSeats(scheduleId: string): Promise<Seat[]> {
    const schedule = await this.scheduleRepository.findById(scheduleId);

    if (!schedule) {
      throw new Error('스케줄을 찾을 수 없습니다.');
    }

    const seats = await this.seatRepository.findAvailables(schedule.id);
    return seats;
  }
}
