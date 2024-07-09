import { Event } from '../models';

export abstract class EventRepository {
  abstract findAll(): Promise<Event[]>;
}
