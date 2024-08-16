import { Consumer } from '@libs/common/decorators';
import { EventPattern, Payload } from '@nestjs/microservices';
import {
  ProgressTransactionUseCase,
  SuccessTransactionUseCase,
} from '../../application/usecases';
import {
  ReservedSeatMessage,
  SucceedReservationMessage,
} from '../dto/messages';

@Consumer()
export class OutboxConsumer {
  constructor(
    private readonly progressTransactionUseCase: ProgressTransactionUseCase,
    private readonly successTransactionUseCase: SuccessTransactionUseCase,
  ) {}

  @EventPattern('reservation.reserved.seat')
  async handleReservedSeat(
    @Payload() payload: ReservedSeatMessage,
  ): Promise<void> {
    const { transactionId } = payload;
    await this.progressTransactionUseCase.execute({ transactionId });
  }

  @EventPattern('reservation.succeed')
  async handleSucceedReservation(
    @Payload() payload: SucceedReservationMessage,
  ): Promise<void> {
    const { transactionId } = payload;
    await this.successTransactionUseCase.execute({ transactionId });
  }
}
