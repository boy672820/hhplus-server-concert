import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { SeatService } from '../../domain/services';
import { ReserveSeatCommand } from './reserve-seat.command';
import { ReservationCancelledEvent } from '../../domain/events';

@CommandHandler(ReserveSeatCommand)
export class ReserveSeatHandler
  implements ICommandHandler<ReserveSeatCommand, void>
{
  constructor(
    private readonly seatService: SeatService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: ReserveSeatCommand): Promise<void> {
    const { seatId, reservationId } = command;

    try {
      await this.seatService.temporarilyReserve(seatId);
    } catch (e) {
      this.eventBus.publish(
        new ReservationCancelledEvent(seatId, reservationId),
      );
    }
  }
}
