import { InjectKafkaClient } from '@libs/kafka-client/decorators';
import { Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ReservationProducer } from '../../domain/producers';

@Injectable()
export class ReservationProducerImpl extends ReservationProducer {
  constructor(@InjectKafkaClient() private readonly kafkaClient: ClientKafka) {
    super();
  }

  emitSucceedReservation(payload: {
    transactionId: string;
    seatId: string;
    reservationId: string;
  }): void {
    this.kafkaClient.emit('reservation.succeed', payload);
  }
}
