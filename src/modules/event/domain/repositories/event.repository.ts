import { Event } from '../models';

export abstract class EventRepository {
  abstract findById(id: string): Promise<Event | null>;
  abstract findAll(): Promise<Event[]>;
}
