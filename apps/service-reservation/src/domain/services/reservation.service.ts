import { Injectable } from '@nestjs/common';
import { MockApiAdapter } from '../adapters';

@Injectable()
export class ReservationService {
  constructor(private readonly mockApiAdapter: MockApiAdapter) {}

  async sendMockApi({
    seatId,
    reservationId,
  }: {
    seatId: string;
    reservationId: string;
  }): Promise<void> {
    await this.mockApiAdapter.send(seatId, reservationId);
  }
}
