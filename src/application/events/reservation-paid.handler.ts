import { MockApiService } from '@lib/mock';
import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ReservationPaidEvent } from '../../domain/events';

@EventsHandler(ReservationPaidEvent)
export class ReservationPaidHandler
  implements IEventHandler<ReservationPaidEvent>
{
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly mockApiService: MockApiService,
  ) {}

  async handle(event: ReservationPaidEvent) {
    const { reservationId, seatId, amount } = event;

    this.logger.info(
      `[예약 결제됨] 예약 ID: ${reservationId} / 좌석 ID: ${seatId} / 결제 금액: ${amount}`,
    );

    await this.mockApiService.send(reservationId, seatId, amount);
  }
}
