import { ApplicationError, DomainError, DomainErrorCode } from '@lib/errors';
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
    try {
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
    } catch (e) {
      if (e instanceof DomainError) {
        switch (e.code) {
          case DomainErrorCode.NotFound:
            throw ApplicationError.notFound(e.message);
          case DomainErrorCode.Conflict:
            throw ApplicationError.conflict(e.message);
        }
      }
      throw ApplicationError.internalError(e.message);
    }
  }
}
