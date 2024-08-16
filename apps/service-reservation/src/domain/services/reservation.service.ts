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
    seatId,
    reservationId,
  }: {
    seatId: string;
    reservationId: string;
  }): Promise<void> {
    await this.mockApiAdapter.send(seatId, reservationId);

    this.reservationProducer.emitSuccessedReservation({
      seatId,
      reservationId,
    });
  }
}
