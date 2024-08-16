import { ClientsProviderAsyncOptions, Transport } from '@nestjs/microservices';
import { ulid } from 'ulid';
import { KAFKA_CLIENT } from './kafka-client.token';
import { KafkaClientAsyncOptions } from './kafka-client.interface';

export const clientAsyncProvider = (
  asyncOptions: KafkaClientAsyncOptions,
): ClientsProviderAsyncOptions => ({
  name: KAFKA_CLIENT,
  imports: asyncOptions?.imports || [],
  useFactory: async (...args: any[]) => {
    const options = asyncOptions?.useFactory(...args);
    return {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: `producer-${ulid()}`,
          brokers: options.brokers,
        },
        consumer: {
          groupId: 'reservation-consumer',
        },
        producerOnlyMode: true,
      },
    };
  },
  inject: asyncOptions?.inject || [],
});
