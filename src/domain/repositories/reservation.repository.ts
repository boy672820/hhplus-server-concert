import { Reservation } from '../models';

export abstract class ReservationRepository {
  abstract findById(id: string): Promise<Reservation | null>;
  abstract save(reservation: Reservation): Promise<void>;
  abstract remove(reservation: Reservation): Promise<void>;
}
