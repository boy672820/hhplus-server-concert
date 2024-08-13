import { Consumer } from '@libs/common/decorators';
import { EventPattern, Payload } from '@nestjs/microservices';
import { InvokeMockApiUseCase } from '../../application/usecases';
import { ReservedSeatMessage } from '../dto/messages';

@Consumer()
export class ReservationConsumer {
  constructor(private readonly invokeMockApiUseCase: InvokeMockApiUseCase) {}

  @EventPattern('reservation.reserved.seat')
  async handleReservedSeat(@Payload() data: ReservedSeatMessage) {
    const { seatId, reservationId } = data;
    await this.invokeMockApiUseCase.execute({ seatId, reservationId });
  }
}
