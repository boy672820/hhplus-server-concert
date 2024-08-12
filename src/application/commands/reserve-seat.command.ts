export class ReserveSeatCommand {
  constructor(
    public readonly seatId: string,
    public readonly reservationId: string,
  ) {}
}
