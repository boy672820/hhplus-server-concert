import { Injectable } from '@nestjs/common';
import { EventService } from '../../domain/services';
import { Event } from '../../domain/models';

@Injectable()
export class FindEventsUseCase {
  constructor(private readonly eventService: EventService) {}

  async execute(): Promise<Event[]> {
    const events = await this.eventService.findAll();
    return events;
  }
}
