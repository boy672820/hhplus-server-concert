import { Injectable } from '@nestjs/common';
import { ReservationService, SeatService } from '../../domain/services';
import { Reservation } from '../../domain/models';

@Injectable()
export class ReserveUseCase {
  constructor(
    private readonly seatService: SeatService,
    private readonly reservationService: ReservationService,
  ) {}

  async execute({
    userId,
    seatId,
  }: {
    userId: string;
    seatId: string;
  }): Promise<Reservation> {
    const seat = await this.seatService.temporarilyReserve(seatId);
    const reservation = await this.reservationService.create({
      userId,
      seatId: seat.id,
      seatNumber: seat.number,
      price: seat.price,
      eventId: seat.eventId,
      scheduleStartDate: seat.scheduleStartDate,
      scheduleEndDate: seat.scheduleEndDate,
    });
    return reservation;
  }
}
