import { KafkaConfigModule, KafkaConfigService } from '@libs/config/kafka';
import { ClientsProviderAsyncOptions, Transport } from '@nestjs/microservices';
import { ulid } from 'ulid';

export const clientProvider: ClientsProviderAsyncOptions = {
  name: 'KAFKA_CLIENT',
  useFactory: async (configService: KafkaConfigService) => ({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: `producer-${ulid()}`,
        brokers: [`${configService.host}:${configService.port}`],
      },
      consumer: {
        groupId: 'reservation-consumer',
      },
      producerOnlyMode: true,
    },
  }),
  imports: [KafkaConfigModule],
  inject: [KafkaConfigService],
};
