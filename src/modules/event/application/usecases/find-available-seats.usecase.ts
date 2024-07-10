import { Injectable } from '@nestjs/common';
import { EventService } from '../../domain/services';

@Injectable()
export class FindAvailableSeatsUseCase {
  constructor(private readonly eventService: EventService) {}

  async execute({ scheduleId }: { scheduleId: string }) {
    const seats = await this.eventService.findAvailableSeats(scheduleId);
    return seats;
  }
}
