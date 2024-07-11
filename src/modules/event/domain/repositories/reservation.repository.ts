import { Reservation } from '../models';

export abstract class ReservationRepository {
  abstract save(reservation: Reservation): Promise<void>;
}
