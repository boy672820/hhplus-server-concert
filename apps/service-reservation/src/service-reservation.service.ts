import { Injectable } from '@nestjs/common';

@Injectable()
export class ServiceReservationService {
  getHello(): string {
    return 'Hello World!';
  }
}
