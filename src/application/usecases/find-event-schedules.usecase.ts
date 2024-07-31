import { LocalDateTime } from '@lib/types';
import { Injectable } from '@nestjs/common';
import { Schedule } from '../../domain/models';
import { EventService } from '../../domain/services';

@Injectable()
export class FindEventSchedulesUseCase {
  constructor(private readonly eventService: EventService) {}

  async execute({
    eventId,
    between,
  }: {
    eventId: string;
    between: { startDate: LocalDateTime; endDate: LocalDateTime };
  }): Promise<Schedule[]> {
    return this.eventService.findSchedulesBetweenByEventId({
      eventId,
      between,
    });
  }
}
