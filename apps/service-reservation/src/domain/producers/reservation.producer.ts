export abstract class ReservationProducer {
  abstract emitSucceedReservation(payload: {
    transactionId: string;
    seatId: string;
    reservationId: string;
  }): void;
}
