import { SeatStatus } from '@lib/types';
import { DomainError } from '@lib/errors';
import { Seat } from './seat.model';

describe('Seat', () => {
  let seat: Seat;

  beforeEach(() => {
    seat = Seat.from({
      id: '1',
      eventId: '1',
      number: 1,
      status: SeatStatus.Pending,
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
});
