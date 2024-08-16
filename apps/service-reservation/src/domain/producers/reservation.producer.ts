export abstract class ReservationProducer {
  abstract emitSuccessedReservation(payload: {
    reservationId: string;
    seatId: string;
  }): void;
}
