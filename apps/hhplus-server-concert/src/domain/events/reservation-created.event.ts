interface Props {
  transactionId: string;
  seatId: string;
  reservationId: string;
}

type EventPayload = Pick<Props, 'seatId' | 'reservationId'>;

export class ReservationCreatedEvent implements Props {
  constructor(
    public readonly transactionId: string,
    public readonly seatId: string,
    public readonly reservationId: string,
  ) {}

  static toPayload = <T extends EventPayload = EventPayload>(props: T): T =>
    props;
}
