import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ReservationReservedSeatEvent } from '../../domain/events';
import { ReservationService } from '../../domain/services';

@EventsHandler(ReservationReservedSeatEvent)
export class ReservationReservedSeatHandler
  implements IEventHandler<ReservationReservedSeatEvent>
{
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly reservationService: ReservationService,
  ) {}

  async handle(event: ReservationReservedSeatEvent) {
    const { transactionId, seatId, reservationId } = event;

    this.reservationService.emitReservedSeat({
      transactionId,
      seatId,
      reservationId,
    });

    this.logger.info(
      `[좌석 예약됨] 예약 ID: ${event.reservationId} / 좌석 ID: ${event.seatId}`,
    );
  }
}
