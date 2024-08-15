import { Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InjectKafkaClient } from '../../lib/decorators';
import { ReservationProducer } from '../../domain/producers';

@Injectable()
export class ReservationProducerImpl implements ReservationProducer {
  constructor(@InjectKafkaClient() private readonly kafkaClient: ClientKafka) {}

  emitReservedSeat(payload: {
    transactionId: string;
    seatId: string;
    reservationId: string;
  }): void {
    this.kafkaClient.emit('reservation.reserved.seat', payload);
  }
}
