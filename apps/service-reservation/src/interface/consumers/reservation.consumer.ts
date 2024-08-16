import { Consumer } from '@libs/common/decorators';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ReserveSeatUseCase } from '../../application/usecases';
import { ReservedSeatMessage } from '../dto/messages';

@Consumer()
export class ReservationConsumer {
  constructor(private readonly reserveSeatUseCase: ReserveSeatUseCase) {}

  @EventPattern('reservation.reserved.seat')
  async handleReservedSeat(@Payload() data: ReservedSeatMessage) {
    const { seatId, reservationId } = data;
    await this.reserveSeatUseCase.execute({ seatId, reservationId });
  }
}
