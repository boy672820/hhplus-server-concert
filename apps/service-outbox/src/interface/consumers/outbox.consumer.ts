import { Consumer } from '@libs/common/decorators';
import { EventPattern } from '@nestjs/microservices';
import { PublishReservedSeatUseCase } from '../../application/usecases';

@Consumer()
export class OutboxConsumer {
  constructor(
    private readonly publishReservedSeatUseCase: PublishReservedSeatUseCase,
  ) {}

  @EventPattern('reservation.reserved.seat')
  async handleReservedSeat(): Promise<void> {
    await this.publishReservedSeatUseCase.execute();
  }
}
