import { Controller, Get } from '@nestjs/common';
import { ServiceReservationService } from './service-reservation.service';

@Controller()
export class ServiceReservationController {
  constructor(private readonly serviceReservationService: ServiceReservationService) {}

  @Get()
  getHello(): string {
    return this.serviceReservationService.getHello();
  }
}
