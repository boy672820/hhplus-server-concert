import { LocalDateTime, ReservationStatus } from '@libs/domain/types';
import { DomainError } from '@libs/common/errors';
import Decimal from 'decimal.js';
import { Reservation } from './reservation.model';
import { ReservationReservedSeatEvent } from '../events';

describe('Reservation', () => {
  let reservation: Reservation;

  beforeEach(() => {
    reservation = Reservation.create({
      userId: '1',
      seatId: '1',
      seatNumber: 1,
      price: new Decimal(10000),
      eventId: 'event-id',
      eventTitle: 'event-title',
      eventAddress: 'event-address',
      eventStartDate: LocalDateTime.now(),
      eventEndDate: LocalDateTime.now(),
      scheduleStartDate: LocalDateTime.now(),
      scheduleEndDate: LocalDateTime.now(),
    });

    jest.spyOn(reservation, 'apply').mockImplementation(() => {});
  });

  describe('좌석 예약', () => {
    it('좌석을 예약합니다.', () => {
      const seatId = '1';
      const event = new ReservationReservedSeatEvent(seatId);

      reservation.reserveSeat(seatId);

      expect(reservation.apply).toHaveBeenCalledWith(event);
    });
  });

  describe('결제', () => {
    it('예약을 결제합니다.', () => {
      const userId = '1';

      reservation.pay(userId);

      expect(reservation.status).toBe(ReservationStatus.Paid);
    });

    describe('결제에 실패하는 경우', () => {
      it('이미 결제된 예약인 경우', () => {
        const userId = '1';

        reservation.pay(userId);

        expect(() => reservation.pay(userId)).toThrow(
          DomainError.conflict('이미 결제된 예약입니다.'),
        );
      });

      it('다른 사용자가 결제하는 경우', () => {
        const userId = '2';

        expect(() => reservation.pay(userId)).toThrow(
          DomainError.forbidden('다른 사용자의 예약은 결제할 수 없습니다.'),
        );
      });
    });
  });
});
