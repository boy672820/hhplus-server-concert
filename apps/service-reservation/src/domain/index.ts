import { Type } from '@nestjs/common';
import { ReservationService } from './services';

export const services: Type<any>[] = [ReservationService];
