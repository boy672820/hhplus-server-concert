import { Module } from '@nestjs/common';
import { ServiceReservationController } from './service-reservation.controller';
import { ServiceReservationService } from './service-reservation.service';

@Module({
  imports: [],
  controllers: [ServiceReservationController],
  providers: [ServiceReservationService],
})
export class ServiceReservationModule {}
