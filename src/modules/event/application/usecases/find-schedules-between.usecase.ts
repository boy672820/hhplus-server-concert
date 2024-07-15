import { LocalDateTime } from '@lib/types';
import { Injectable } from '@nestjs/common';
import { EventService } from '../../domain/services';
import { Schedule } from '../../domain/models';

@Injectable()
export class FindSchedulesBetweenUseCase {
  constructor(private readonly eventService: EventService) {}

  async execute({
    startDate,
    endDate,
  }: {
    startDate: LocalDateTime;
    endDate: LocalDateTime;
  }): Promise<Schedule[]> {
    return this.eventService.findSchedulesBetween({ startDate, endDate });
  }
}
