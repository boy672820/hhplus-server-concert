import { InjectLogger } from '@libs/logger/decorators';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { LoggerService } from '@libs/logger';
import { ReservationPaidEvent } from '../../domain/events';

@EventsHandler(ReservationPaidEvent)
export class ReservationPaidHandler
  implements IEventHandler<ReservationPaidEvent>
{
  constructor(@InjectLogger() private readonly logger: LoggerService) {}

  async handle(event: ReservationPaidEvent) {
    const { reservationId, seatId } = event;

    this.logger.info('예약 결제됨', 'ReservationPaidHandler', {
      reservationId,
      seatId,
    });
  }
}
