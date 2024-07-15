import { ApplicationError, DomainError, DomainErrorCode } from '@lib/errors';
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
    try {
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
    } catch (e) {
      if (e instanceof DomainError) {
        switch (true) {
          case e.code === DomainErrorCode.NotFound:
            throw ApplicationError.notFound('예약을 찾을 수 없습니다.');
          case e.code === DomainErrorCode.Unauthorized:
            throw ApplicationError.unauthorized('사용자를 찾을 수 없습니다.');
        }
      }
      throw e;
    }
  }
}
