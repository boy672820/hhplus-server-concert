import { DomainError } from '../../lib/errors';
import { mock, MockProxy } from 'jest-mock-extended';
import { Seat } from '../models';
import { SeatRepository } from '../repositories';
import { SeatService } from './seat.service';
import Decimal from 'decimal.js';

describe('SeatService', () => {
  let seat: Seat;
  let seatRepository: MockProxy<SeatRepository>;
  let service: SeatService;

  beforeEach(() => {
    seat = Seat.create({
      eventId: '1',
      number: 1,
      price: new Decimal(10000),
      scheduleId: '1',
    });
    seatRepository = mock<SeatRepository>();
    service = new SeatService(seatRepository);

    seatRepository.findById.mockResolvedValue(seat);
  });

  describe('좌석 임시 예약', () => {
    it('좌석을 임시로 예약합니다.', async () => {
      const seatId = '1';

      const result = await service.temporarilyReserve(seatId);

      expect(result).toEqual(seat);
      expect(seatRepository.save).toHaveBeenCalledWith(seat);
    });

    describe('좌석 임시 예약 실패', () => {
      it('좌석을 찾을 수 없습니다.', async () => {
        const seatId = '2';
        seatRepository.findById.mockResolvedValueOnce(null);

        await expect(service.temporarilyReserve(seatId)).rejects.toThrow(
          DomainError.notFound('좌석을 찾을 수 없습니다.'),
        );
      });
    });
  });

  describe('좌석 결제', () => {
    it('좌석을 결제합니다.', async () => {
      const seatId = '1';

      const result = await service.pay({ seatId });

      expect(result).toEqual(seat);
    });

    describe('좌석 결제에 실패하는 경우', () => {
      it('좌석을 찾을 수 없습니다.', async () => {
        const seatId = '2';
        seatRepository.findById.mockResolvedValueOnce(null);

        await expect(service.pay({ seatId })).rejects.toThrow(
          DomainError.notFound('좌석을 찾을 수 없습니다.'),
        );
      });
    });
  });
});
