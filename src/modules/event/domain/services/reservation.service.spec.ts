import { LocalDateTime } from '@lib/types';
import { mock, MockProxy } from 'jest-mock-extended';
import { EventRepository, ReservationRepository } from '../repositories';
import { ReservationService } from './reservation.service';
import { Event, Reservation } from '../models';
import Decimal from 'decimal.js';

const event = Event.create({
  title: 'event-title',
  address: 'event-address',
  startDate: LocalDateTime.now(),
  endDate: LocalDateTime.now(),
});

describe('ReservationService', () => {
  let reservationRepository: MockProxy<ReservationRepository>;
  let eventRepository: MockProxy<EventRepository>;
  let service: ReservationService;

  beforeEach(() => {
    reservationRepository = mock<ReservationRepository>();
    eventRepository = mock<EventRepository>();
    service = new ReservationService(reservationRepository, eventRepository);

    eventRepository.findById.mockResolvedValue(event);
  });

  describe('예약 생성', () => {
    it('예약을 생성합니다.', async () => {
      const userId = 'user-id';
      const seatId = 'seat-id';
      const seatNumber = 1;
      const price = new Decimal(10000);
      const eventId = 'event-id';
      const scheduleStartDate = LocalDateTime.now();
      const scheduleEndDate = LocalDateTime.now();

      const result = await service.create({
        userId,
        seatId,
        seatNumber,
        price,
        eventId,
        scheduleStartDate,
        scheduleEndDate,
      });

      expect(result).toBeInstanceOf(Reservation);
      expect(reservationRepository.save).toHaveBeenCalled();
    });

    describe('예약 생성에 실패하는 경우', () => {
      it('이벤트를 찾을 수 없는 경우', () => {
        const userId = 'user-id';
        const seatId = 'seat-id';
        const seatNumber = 1;
        const price = new Decimal(10000);
        const eventId = 'event-id';
        const scheduleStartDate = LocalDateTime.now();
        const scheduleEndDate = LocalDateTime.now();
        eventRepository.findById.mockResolvedValueOnce(null);

        expect(
          service.create({
            userId,
            seatId,
            seatNumber,
            price,
            eventId,
            scheduleStartDate,
            scheduleEndDate,
          }),
        ).rejects.toThrow();
      });
    });
  });
});
