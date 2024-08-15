import { LocalDateTime, SeatStatus } from '@libs/domain/types';
import { DomainError } from '@libs/common/errors';
import { Seat } from './seat.model';
import Decimal from 'decimal.js';

describe('Seat', () => {
  let seat: Seat;

  beforeEach(() => {
    seat = Seat.from({
      id: '1',
      eventId: '1',
      number: 1,
      status: SeatStatus.Pending,
      price: new Decimal(10000),
      scheduleId: '1',
      scheduleStartDate: LocalDateTime.now(),
      scheduleEndDate: LocalDateTime.now(),
    });
  });

  describe('임시 예약', () => {
    it('좌석을 임시 예약합니다.', () => {
      seat.temporarilyReserve();

      expect(seat.status).toBe(SeatStatus.InProgress);
    });

    describe('임시 예약 불가', () => {
      it('이미 예약된 좌석입니다.', () => {
        seat.temporarilyReserve();

        expect(() => seat.temporarilyReserve()).toThrow(
          DomainError.conflict('이미 예약된 좌석입니다.'),
        );
      });
    });
  });

  describe('좌석 결제', () => {
    it('좌석의 임시할당을 해제합니다.', () => {
      seat.pay();

      expect(seat.status).toBe(SeatStatus.Completed);
    });

    describe('결제 실패', () => {
      it('이미 결제된 좌석입니다.', () => {
        seat.pay();

        expect(() => seat.pay()).toThrow(
          DomainError.conflict('이미 결제된 좌석입니다.'),
        );
      });
    });
  });
});
