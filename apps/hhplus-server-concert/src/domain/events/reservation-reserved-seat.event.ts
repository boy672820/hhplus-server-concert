export class ReservationReservedSeatEvent {
  constructor(
    public readonly transactionId: string,
    public readonly seatId: string,
    public readonly reservationId: string,
  ) {}
}
