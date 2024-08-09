import { MockApiService } from '@lib/mock';
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ReservationCancelledEvent } from '../../domain/events';

@EventsHandler(ReservationCancelledEvent)
export class ReservationCancelledHandler
  implements IEventHandler<ReservationCancelledEvent>
{
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly mockApiService: MockApiService,
  ) {}

  async handle(event: ReservationCancelledEvent) {
    const { seatId, reservationId } = event;

    this.logger.info(
      `[예약 취소됨] 좌석 ID: ${seatId} / 예약 ID: ${reservationId}`,
    );

    await this.mockApiService.send(reservationId, seatId);
  }
}
