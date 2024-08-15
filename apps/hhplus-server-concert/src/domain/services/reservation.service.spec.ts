import { LocalDateTime, SeatStatus } from '@libs/domain/types';
import { mock, MockProxy } from 'jest-mock-extended';
import {
  EventRepository,
  ReservationRepository,
  ScheduleRepository,
  SeatRepository,
} from '../repositories';
import { ReservationService } from './reservation.service';
import { Event, Reservation, Schedule, Seat } from '../models';
import Decimal from 'decimal.js';
import { DomainError } from '../../lib/errors';
import { ReservationFactory } from '../factories/reservation.factory';
import { ReservationProducer } from '../producers';

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
const seat = Seat.create({
  eventId: '1',
  number: 1,
  price: new Decimal(10000),
  scheduleId: '1',
});

describe('ReservationService', () => {
  let reservationFactory: MockProxy<ReservationFactory>;
  let reservationRepository: MockProxy<ReservationRepository>;
  let eventRepository: MockProxy<EventRepository>;
  let scheduleRepository: MockProxy<ScheduleRepository>;
  let seatRepository: MockProxy<SeatRepository>;
  let reservationProducer: MockProxy<ReservationProducer>;
  let service: ReservationService;

  beforeEach(() => {
    reservationFactory = mock<ReservationFactory>();
    reservationRepository = mock<ReservationRepository>();
    eventRepository = mock<EventRepository>();
    scheduleRepository = mock<ScheduleRepository>();
    seatRepository = mock<SeatRepository>();
    reservationProducer = mock<ReservationProducer>();
    service = new ReservationService(
      reservationFactory,
      reservationRepository,
      eventRepository,
      scheduleRepository,
      seatRepository,
      reservationProducer,
    );

    reservationFactory.create.mockReturnValue(reservation);
    reservationRepository.findById.mockResolvedValue(reservation);
    eventRepository.findById.mockResolvedValue(event);
    scheduleRepository.findById.mockResolvedValue(schedule);
    seatRepository.findById.mockResolvedValue(seat);
  });

  describe('예약 생성', () => {
    it('예약을 생성합니다.', async () => {
      const userId = 'user-id';
      const seatId = 'seat-id';

      const result = await service.create({
        userId,
        seatId,
      });

      expect(result).toBeInstanceOf(Reservation);
      expect(reservationRepository.save).toHaveBeenCalled();
    });

    describe('예약 생성에 실패하는 경우', () => {
      it('좌석을 찾을 수 없는 경우', async () => {
        const userId = 'user-id';
        const seatId = 'seat-id';
        seatRepository.findById.mockResolvedValueOnce(null);

        await expect(
          service.create({
            userId,
            seatId,
          }),
        ).rejects.toThrow();
      });

      it('이미 예약된 좌석인 경우', async () => {
        const userId = 'user-id';
        const seatId = 'seat-id';
        const reservedSeat = Seat.from({
          id: seatId,
          eventId: '1',
          scheduleId: '1',
          number: 1,
          status: SeatStatus.InProgress,
          price: new Decimal(10000),
          version: 0,
        });
        seatRepository.findById.mockResolvedValueOnce(reservedSeat);

        await expect(
          service.create({
            userId,
            seatId,
          }),
        ).rejects.toThrow();
      });

      it('이벤트를 찾을 수 없는 경우', async () => {
        const userId = 'user-id';
        const seatId = 'seat-id';
        eventRepository.findById.mockResolvedValueOnce(null);

        await expect(
          service.create({
            userId,
            seatId,
          }),
        ).rejects.toThrow();
      });

      it('스케줄을 찾을 수 없는 경우', async () => {
        const userId = 'user-id';
        const seatId = 'seat-id';
        scheduleRepository.findById.mockResolvedValueOnce(null);

        await expect(
          service.create({
            userId,
            seatId,
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

    describe('예약 취소', () => {
      it('예약을 취소합니다.', async () => {
        const reservationId = '1';

        await service.cancel(reservationId);

        expect(reservationRepository.remove).toHaveBeenCalledWith(reservation);
      });

      describe('예약 취소에 실패하는 경우', () => {
        it('예약을 찾을 수 없는 경우', async () => {
          const reservationId = '1';
          reservationRepository.findById.mockResolvedValueOnce(null);

          await expect(service.cancel(reservationId)).rejects.toThrow();
        });
      });
    });
  });
});
