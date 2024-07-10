import { Seat } from '../models';

export abstract class SeatRepository {
  abstract findAvailables(scheduleId: string): Promise<Seat[]>;
}
