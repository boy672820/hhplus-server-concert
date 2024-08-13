import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka as Client } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { Event, KafkaClient } from './kafka.client';

@Injectable()
export class KafkaClientImpl implements KafkaClient {
  constructor(@Inject('KAFKA_CLIENT') private readonly client: Client) {}

  emit<TResult = any, TInput extends Event = Event>(
    topic: string,
    event: TInput,
  ): Observable<TResult> {
    return this.client.emit<TResult, TInput>(topic, event.toJSON());
  }
}
