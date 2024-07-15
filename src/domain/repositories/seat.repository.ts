import { Seat } from '../models';

export abstract class SeatRepository {
  abstract findById(id: string): Promise<Seat | null>;
  abstract findAvailables(scheduleId: string): Promise<Seat[]>;
  abstract save(seat: Seat): Promise<void>;
}
