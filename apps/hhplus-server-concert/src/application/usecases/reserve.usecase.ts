import { Injectable } from '@nestjs/common';
import { ReservationService } from '../../domain/services';
import { Reservation } from '../../domain/models';

@Injectable()
export class ReserveUseCase {
  constructor(private readonly reservationService: ReservationService) {}

  async execute({
    userId,
    seatId,
  }: {
    userId: string;
    seatId: string;
  }): Promise<Reservation> {
    const reservation = await this.reservationService.create({
      userId,
      seatId,
    });
    return reservation;
  }
}
