export class ReservationCancelledEvent {
  constructor(
    public readonly seatId: string,
    public readonly reservationId: string,
  ) {}
}
