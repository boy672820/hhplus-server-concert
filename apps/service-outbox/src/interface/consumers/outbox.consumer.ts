import { Consumer } from '@libs/common/decorators';
import { EventPattern } from '@nestjs/microservices';

@Consumer()
export class OutboxConsumer {
  constructor() {}

  @EventPattern('reservation.reserved.seat')
  async handleReservedSeat(): Promise<void> {}
}
