import { Inject, Injectable } from '@nestjs/common';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ReservationService } from '../../domain/services';
import { Reservation } from '../../domain/models';

@Injectable()
export class ReserveUseCase {
  constructor(
    private readonly reservationService: ReservationService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
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
