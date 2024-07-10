import { LocalDateTime } from '@lib/types';
import { Injectable } from '@nestjs/common';
import { EventRepository, ScheduleRepository } from '../repositories';
import { Event, Schedule } from '../models';

@Injectable()
export class EventService {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly scheduleRepository: ScheduleRepository,
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
}
