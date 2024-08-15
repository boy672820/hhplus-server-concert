import { Consumer } from '@libs/common/decorators';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ProgressTransactionUseCase } from '../../application/usecases';
import { ReservedSeatMessage } from '../dto/messages';

@Consumer()
export class OutboxConsumer {
  constructor(
    private readonly progressTransactionUseCase: ProgressTransactionUseCase,
  ) {}

  @EventPattern('reservation.reserved.seat')
  async handleReservedSeat(
    @Payload() payload: ReservedSeatMessage,
  ): Promise<void> {
    const { transactionId } = payload;
    await this.progressTransactionUseCase.execute({ transactionId });
  }
}
