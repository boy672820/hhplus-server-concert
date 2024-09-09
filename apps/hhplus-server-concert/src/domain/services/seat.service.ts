import { DomainError } from '@libs/common/errors';
import { Injectable } from '@nestjs/common';
import { Seat } from '../models';
import { SeatRepository } from '../repositories';
import { OptimisticLockVersionMismatchError } from 'typeorm';

@Injectable()
export class SeatService {
  constructor(private readonly seatRepository: SeatRepository) {}

  async temporarilyReserve(
    seatId: string,
    reservationId: string,
  ): Promise<Seat> {
    const seat = await this.seatRepository.findById(seatId);

    if (!seat) {
      throw DomainError.notFound('좌석을 찾을 수 없습니다.');
    }

    seat.temporarilyReserve(reservationId);

    await this.seatRepository.save(seat);

    seat.commit();

    return seat;
  }

  async pay({ seatId }: { seatId: string }): Promise<Seat> {
    try {
      const seat = await this.seatRepository.findById(seatId);

      if (!seat) {
        throw DomainError.notFound('좌석을 찾을 수 없습니다.');
      }

      seat.pay();

      await this.seatRepository.save(seat);

      return seat;
    } catch (e) {
      if (e instanceof OptimisticLockVersionMismatchError) {
        throw DomainError.conflict('이미 결제된 좌석입니다.');
      }
      throw e;
    }
  }
}
