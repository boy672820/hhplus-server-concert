export abstract class ReservationProducer {
  abstract emitReservedSeat(payload: {
    seatId: string;
    reservationId: string;
  }): void;
}
