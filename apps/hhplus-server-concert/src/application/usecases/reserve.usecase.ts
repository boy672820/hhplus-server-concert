import { InjectLogger } from '@libs/logger/decorators';
import { Injectable } from '@nestjs/common';
import { LoggerService } from '@libs/logger';
import { ReservationService } from '../../domain/services';
import { Reservation } from '../../domain/models';

@Injectable()
export class ReserveUseCase {
  constructor(
    private readonly reservationService: ReservationService,
    @InjectLogger() private readonly logger: LoggerService,
  ) {}

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
    this.logger.info(`[예약 생성] 예약 ID: ${reservation.id}`);
    return reservation;
  }
}
