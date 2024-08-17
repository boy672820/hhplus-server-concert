import { EventType } from '@libs/domain/types';
import { InjectKafkaClient } from '@libs/kafka-client/decorators';
import { Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionProducer } from '../../domain/producers';

@Injectable()
export class TransactionProducerImpl implements TransactionProducer {
  constructor(@InjectKafkaClient() private readonly kafkaClient: ClientKafka) {}

  emitTransaction(eventType: EventType, payload: Record<string, any>): void {
    this.kafkaClient.emit(eventType, payload);
  }
}
