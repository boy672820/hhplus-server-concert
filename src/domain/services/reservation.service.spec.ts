import { LocalDateTime } from '@lib/types';
import { mock, MockProxy } from 'jest-mock-extended';
import {
  EventRepository,
  ReservationRepository,
  ScheduleRepository,
} from '../repositories';
import { ReservationService } from './reservation.service';
import { Event, Reservation, Schedule } from '../models';
import Decimal from 'decimal.js';
import { DomainError } from '../../lib/errors';

const event = Event.create({
  title: 'event-title',
  address: 'event-address',
  startDate: LocalDateTime.now(),
  endDate: LocalDateTime.now(),
});
const schedule = Schedule.create({
  startDate: LocalDateTime.now(),
  endDate: LocalDateTime.now(),
});
const reservation = Reservation.create({
  userId: '1',
  eventId: '1',
  eventTitle: 'event-title',
  eventAddress: 'event-address',
  eventStartDate: LocalDateTime.now(),
  eventEndDate: LocalDateTime.now(),
  seatId: 'seat-id',
  seatNumber: 1,
  price: new Decimal(10000),
  scheduleStartDate: LocalDateTime.now(),
  scheduleEndDate: LocalDateTime.now(),
});

describe('ReservationService', () => {
  let reservationRepository: MockProxy<ReservationRepository>;
  let eventRepository: MockProxy<EventRepository>;
  let scheduleRepository: MockProxy<ScheduleRepository>;
  let service: ReservationService;

  beforeEach(() => {
    reservationRepository = mock<ReservationRepository>();
    eventRepository = mock<EventRepository>();
    scheduleRepository = mock<ScheduleRepository>();
    service = new ReservationService(
      reservationRepository,
      scheduleRepository,
      eventRepository,
    );

    eventRepository.findById.mockResolvedValue(event);
    scheduleRepository.findById.mockResolvedValue(schedule);
    reservationRepository.findById.mockResolvedValue(reservation);
  });

  describe('예약 생성', () => {
    it('예약을 생성합니다.', async () => {
      const userId = 'user-id';
      const seatId = 'seat-id';
      const seatNumber = 1;
      const price = new Decimal(10000);
      const eventId = 'event-id';
      const scheduleId = 'schedule-id';

      const result = await service.create({
        userId,
        seatId,
        seatNumber,
        price,
        eventId,
        scheduleId,
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
        const scheduleId = 'schedule-id';
        eventRepository.findById.mockResolvedValueOnce(null);

        expect(
          service.create({
            userId,
            seatId,
            seatNumber,
            price,
            eventId,
            scheduleId,
          }),
        ).rejects.toThrow();
      });

      it('스케줄을 찾을 수 없는 경우', () => {
        const userId = 'user-id';
        const seatId = 'seat-id';
        const seatNumber = 1;
        const price = new Decimal(10000);
        const eventId = 'event-id';
        const scheduleId = 'schedule-id';
        scheduleRepository.findById.mockResolvedValueOnce(null);

        expect(
          service.create({
            userId,
            seatId,
            seatNumber,
            price,
            eventId,
            scheduleId,
          }),
        ).rejects.toThrow();
      });
    });

    describe('예약 결제', () => {
      it('예약을 결제합니다.', async () => {
        const userId = '1';
        const reservationId = '1';

        const result = await service.pay({ userId, reservationId });

        expect(result).toEqual(reservation);
        expect(reservationRepository.save).toHaveBeenCalledWith(reservation);
      });

      describe('예약 결제에 실패하는 경우', () => {
        it('예약을 찾을 수 없는 경우', () => {
          const userId = '1';
          const reservationId = '1';
          reservationRepository.findById.mockResolvedValueOnce(null);

          expect(service.pay({ userId, reservationId })).rejects.toThrow(
            DomainError.notFound('예약을 찾을 수 없습니다.'),
          );
        });
      });
    });
  });
});
