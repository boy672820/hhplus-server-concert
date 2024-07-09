import { Injectable } from '@nestjs/common';
import { EventRepository } from '../repositories';
import { Event } from '../models';

@Injectable()
export class EventService {
  constructor(private readonly eventRepository: EventRepository) {}

  async findAll(): Promise<Event[]> {
    const events = await this.eventRepository.findAll();
    return events;
  }
}
