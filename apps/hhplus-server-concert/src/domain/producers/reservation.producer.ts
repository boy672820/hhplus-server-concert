export abstract class ReservationProducer {
  abstract emitReservedSeat(payload: {
    transactionId: string;
    seatId: string;
    reservationId: string;
  }): void;
}
