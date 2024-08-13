import { Injectable } from '@nestjs/common';
import { ReservationService } from '../../domain/services';

@Injectable()
export class InvokeMockApiUseCase {
  constructor(private readonly reservationService: ReservationService) {}

  async execute({
    seatId,
    reservationId,
  }: {
    seatId: string;
    reservationId: string;
  }): Promise<void> {
    await this.reservationService.sendMockApi({ seatId, reservationId });
  }
}
