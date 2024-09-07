import { LoggerService } from '@libs/logger';
import { InjectLogger } from '@libs/logger/decorators';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SeatReservedEvent } from '../../domain/events';

@EventsHandler(SeatReservedEvent)
export class SeatReservedHandler implements IEventHandler<SeatReservedEvent> {
  constructor(@InjectLogger() private readonly logger: LoggerService) {}

  async handle(event: SeatReservedEvent) {
    const { seatId, reservationId } = event;

    this.logger.info('좌석 예약됨', 'SeatReservedHandler', {
      seatId,
      reservationId,
    });
  }
}
