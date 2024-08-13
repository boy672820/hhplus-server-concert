import { Consumer } from '@libs/common/decorators';
import { EventPattern, Payload } from '@nestjs/microservices';

class ReservedSeatMessage {
  reservationId: string;
  seatId: string;
}

@Consumer()
export class ReservationConsumer {
  @EventPattern('reservation.reserved.seat')
  async handleReservedSeat(@Payload() data: ReservedSeatMessage) {
    console.log('Recived data:', typeof data, data);
  }
}
