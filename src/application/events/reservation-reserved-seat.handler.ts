import { MockApiService } from '@lib/mock';
import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ReservationReservedSeatEvent } from '../../domain/events';

@EventsHandler(ReservationReservedSeatEvent)
export class ReservationReservedSeatHandler
  implements IEventHandler<ReservationReservedSeatEvent>
{
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly mockApiService: MockApiService,
  ) {}

  async handle(event: ReservationReservedSeatEvent) {
    const { reservationId, seatId } = event;

    this.logger.info(
      `[좌석 예약됨] 예약 ID: ${event.reservationId} / 좌석 ID: ${event.seatId}`,
    );

    await this.mockApiService.send(reservationId, seatId);
  }
}
