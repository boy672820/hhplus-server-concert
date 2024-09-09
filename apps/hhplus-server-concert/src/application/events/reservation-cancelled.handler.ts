import { MockApiService } from '@libs/mock-api';
import { InjectLogger } from '@libs/logger/decorators';
import { LoggerService } from '@libs/logger';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ReservationCancelledEvent } from '../../domain/events';

@EventsHandler(ReservationCancelledEvent)
export class ReservationCancelledHandler
  implements IEventHandler<ReservationCancelledEvent>
{
  constructor(
    @InjectLogger() private readonly logger: LoggerService,
    private readonly mockApiService: MockApiService,
  ) {}

  async handle(event: ReservationCancelledEvent) {
    const { seatId, reservationId } = event;

    this.logger.info('예약 취소됨', 'ReservationCancelledHandler', {
      seatId,
      reservationId,
    });

    await this.mockApiService.send(reservationId, seatId);
  }
}
