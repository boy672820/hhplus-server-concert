import { Type } from '@nestjs/common';
import { ReservationConsumer } from './consumers/reservation.consumer';

export const consumers: Type<any>[] = [ReservationConsumer];
