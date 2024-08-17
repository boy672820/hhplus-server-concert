import { Injectable } from '@nestjs/common';
import { ReservationService } from '../../domain/services';

@Injectable()
export class ReserveSeatUseCase {
  constructor(private readonly reservationService: ReservationService) {}

  async execute({
    transactionId,
    seatId,
    reservationId,
  }: {
    transactionId: string;
    seatId: string;
    reservationId: string;
  }): Promise<void> {
    await this.reservationService.reserveSeat({
      transactionId,
      seatId,
      reservationId,
    });
  }
}
