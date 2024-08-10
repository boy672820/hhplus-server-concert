export class ReservationPaidEvent {
  constructor(
    public readonly reservationId: string,
    public readonly seatId: string,
    public readonly amount: string,
  ) {}
}
