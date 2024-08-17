import { KafkaConfigModule, KafkaConfigService } from '@libs/config/kafka';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ServiceReservationModule } from './service-reservation.module';
import { ulid } from 'ulid';

async function bootstrap() {
  const kafkaConfigModule = await NestFactory.create(KafkaConfigModule);
  const kafkaConfigService = kafkaConfigModule.get(KafkaConfigService);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ServiceReservationModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: `consumer-${ulid()}`,
          brokers: [`${kafkaConfigService.host}:${kafkaConfigService.port}`],
        },
        consumer: {
          groupId: 'reservation-consumer',
        },
      },
    },
  );

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen();
}
bootstrap();
