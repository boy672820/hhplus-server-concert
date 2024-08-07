export class ReservationReservedSeatEvent {
  constructor(
    public readonly seatId: string,
    public readonly reservationId: string,
  ) {}
}
