export class SeatReservedEvent {
  constructor(
    public readonly seatId: string,
    public readonly reservationId: string,
  ) {}
}
