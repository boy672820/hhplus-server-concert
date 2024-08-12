import { NestFactory } from '@nestjs/core';
import { ServiceReservationModule } from './service-reservation.module';

async function bootstrap() {
  const app = await NestFactory.create(ServiceReservationModule);
  await app.listen(3000);
}
bootstrap();
