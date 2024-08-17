import { KafkaConfigModule, KafkaConfigService } from '@libs/config/kafka';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ulid } from 'ulid';
import { ServiceOutboxModule } from './service-outbox.module';

async function bootstrap() {
  const kafkaConfigModule = await NestFactory.create(KafkaConfigModule);
  const kafkaConfigService = kafkaConfigModule.get(KafkaConfigService);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ServiceOutboxModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: `consumer-${ulid()}`,
          brokers: [`${kafkaConfigService.host}:${kafkaConfigService.port}`],
        },
        consumer: {
          groupId: 'outbox-consumer',
        },
      },
    },
  );

  await app.listen();
}
bootstrap();
