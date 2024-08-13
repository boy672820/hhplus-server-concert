import { KafkaConfigModule, KafkaConfigService } from '@libs/config/kafka';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ServiceReservationModule } from './service-reservation.module';

async function bootstrap() {
  const kafkaConfigModule = await NestFactory.create(KafkaConfigModule);
  const kafkaConfigService = kafkaConfigModule.get(KafkaConfigService);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ServiceReservationModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [`${kafkaConfigService.host}:${kafkaConfigService.port}`],
        },
      },
    },
  );

  await app.listen();
}
bootstrap();
