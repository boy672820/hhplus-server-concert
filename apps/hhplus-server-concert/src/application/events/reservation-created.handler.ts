import { InjectLogger } from '@libs/logger/decorators';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { LoggerService } from '@libs/logger';
import { ReservationCreatedEvent } from '../../domain/events';
import { ReservationService } from '../../domain/services';

@EventsHandler(ReservationCreatedEvent)
export class ReservationCreatedHandler
  implements IEventHandler<ReservationCreatedEvent>
{
  constructor(
    @InjectLogger() private readonly logger: LoggerService,
    private readonly reservationService: ReservationService,
  ) {}

  async handle(event: ReservationCreatedEvent) {
    const { transactionId, seatId, reservationId } = event;

    this.logger.info('예약 생성됨', 'ReservationCreatedHandler', {
      transactionId,
      seatId,
      reservationId,
    });

    this.reservationService.emitReservedSeat({
      transactionId,
      seatId,
      reservationId,
    });
  }
}
