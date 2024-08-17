import { Injectable } from '@nestjs/common';
import { MockApiAdapter } from '../adapters';
import { ReservationProducer } from '../producers';

@Injectable()
export class ReservationService {
  constructor(
    private readonly mockApiAdapter: MockApiAdapter,
    private readonly reservationProducer: ReservationProducer,
  ) {}

  async reserveSeat({
    transactionId,
    seatId,
    reservationId,
  }: {
    transactionId: string;
    seatId: string;
    reservationId: string;
  }): Promise<void> {
    await this.mockApiAdapter.send(seatId, reservationId);

    this.reservationProducer.emitSucceedReservation({
      transactionId,
      seatId,
      reservationId,
    });
  }
}
