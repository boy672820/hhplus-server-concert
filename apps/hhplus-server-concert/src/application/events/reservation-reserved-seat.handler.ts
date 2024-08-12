import { InjectKafkaClient } from '../../lib/decorators';
import { Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
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
    @InjectKafkaClient() private readonly kafkaClient: ClientKafka,
  ) {}

  async handle(event: ReservationReservedSeatEvent) {
    this.logger.info(
      `[좌석 예약됨] 예약 ID: ${event.reservationId} / 좌석 ID: ${event.seatId}`,
    );

    this.kafkaClient.emit('reservation.reserved.seat', event);
  }
}
