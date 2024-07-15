import { Injectable } from '@nestjs/common';
import {
  PaymentService,
  ReservationService,
  SeatService,
  PointService,
} from '../../domain/services';

@Injectable()
export class PayReservationUseCase {
  constructor(
    private readonly reservationService: ReservationService,
    private readonly seatService: SeatService,
    private readonly userService: PointService,
    private readonly paymentService: PaymentService,
  ) {}

  async execute({
    userId,
    reservationId,
  }: {
    userId: string;
    reservationId: string;
  }) {
    const reservation = await this.reservationService.pay({
      userId,
      reservationId,
    });
    await this.seatService.pay({ seatId: reservation.seatId });
    await this.userService.pay({ userId, amount: reservation.price });

    const payment = await this.paymentService.create({
      reservationId,
      amount: reservation.price,
    });

    return payment;
  }
}
