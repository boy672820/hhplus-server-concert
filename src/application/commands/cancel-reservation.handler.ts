import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CancelReservationCommand } from './cancel-reservation.command';
import { ReservationService } from '../../domain/services';

@CommandHandler(CancelReservationCommand)
export class CancelReservationHandler
  implements ICommandHandler<CancelReservationCommand, void>
{
  constructor(private readonly reservationService: ReservationService) {}

  async execute(command: CancelReservationCommand): Promise<void> {
    const { reservationId } = command;

    await this.reservationService.cancel(reservationId);
  }
}
