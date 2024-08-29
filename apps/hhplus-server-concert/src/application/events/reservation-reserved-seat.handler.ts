import { InjectLogger } from '@libs/logger/decorators';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { LoggerService } from '@libs/logger';
import { ReservationReservedSeatEvent } from '../../domain/events';
import { ReservationService } from '../../domain/services';

@EventsHandler(ReservationReservedSeatEvent)
export class ReservationReservedSeatHandler
  implements IEventHandler<ReservationReservedSeatEvent>
{
  constructor(
    @InjectLogger() private readonly logger: LoggerService,
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
