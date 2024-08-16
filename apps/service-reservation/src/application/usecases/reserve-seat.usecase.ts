import { Injectable } from '@nestjs/common';
import { ReservationService } from '../../domain/services';

@Injectable()
export class ReserveSeatUseCase {
  constructor(private readonly reservationService: ReservationService) {}

  async execute({
    seatId,
    reservationId,
  }: {
    seatId: string;
    reservationId: string;
  }): Promise<void> {
    await this.reservationService.reserveSeat({ seatId, reservationId });
  }
}
