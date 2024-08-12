import { DomainError } from '../../lib/errors';
import { Injectable } from '@nestjs/common';
import { Seat } from '../models';
import { SeatRepository } from '../repositories';

@Injectable()
export class SeatService {
  constructor(private readonly seatRepository: SeatRepository) {}

  async temporarilyReserve(seatId: string): Promise<Seat> {
    const seat = await this.seatRepository.findById(seatId);

    if (!seat) {
      throw DomainError.notFound('좌석을 찾을 수 없습니다.');
    }

    seat.temporarilyReserve();

    await this.seatRepository.save(seat);

    return seat;
  }

  async pay({ seatId }: { seatId: string }): Promise<Seat> {
    const seat = await this.seatRepository.findById(seatId);

    if (!seat) {
      throw DomainError.notFound('좌석을 찾을 수 없습니다.');
    }

    seat.pay();

    await this.seatRepository.save(seat);

    return seat;
  }
}
