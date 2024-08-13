import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ReservationReservedSeatEvent } from '../../domain/events';
import { KafkaClient } from '../../lib/kafka';

@EventsHandler(ReservationReservedSeatEvent)
export class ReservationReservedSeatHandler
  implements IEventHandler<ReservationReservedSeatEvent>
{
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly kafkaClient: KafkaClient,
  ) {}

  async handle(event: ReservationReservedSeatEvent) {
    this.logger.info(
      `[좌석 예약됨] 예약 ID: ${event.reservationId} / 좌석 ID: ${event.seatId}`,
    );

    this.kafkaClient.emit('reservation.reserved.seat', event);
  }
}
