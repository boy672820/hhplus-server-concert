import { Injectable } from '@nestjs/common';
import { ReservationProducer } from '../../domain/producers';

@Injectable()
export class ReservationProducerImpl extends ReservationProducer {
  emitSuccessedReservation(payload: {
    reservationId: string;
    seatId: string;
  }): void {}
}
