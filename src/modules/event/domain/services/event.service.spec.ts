import { LocalDateTime } from '@lib/types';
import { Test } from '@nestjs/testing';
import { mock, MockProxy } from 'jest-mock-extended';
import { EventService } from './event.service';
import { EventRepository, ScheduleRepository } from '../repositories';
import { Event, Schedule, Seat } from '../models';
import { SeatRepository } from '../repositories/seat.repository';

const event = Event.create({
  title: '이벤트1',
  address: '',
  startDate: LocalDateTime.now(),
  endDate: LocalDateTime.now(),
});
const schedule = Schedule.create({
  startDate: LocalDateTime.now(),
  endDate: LocalDateTime.now(),
});
const seat = Seat.create({ eventId: '1', number: 1 });

describe('EventService', () => {
  let eventService: EventService;
  let eventRepository: MockProxy<EventRepository>;
  let scheduleRepository: MockProxy<ScheduleRepository>;
  let seatRepository: MockProxy<SeatRepository>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        EventService,
        {
          provide: EventRepository,
          useValue: mock<EventRepository>(),
        },
        {
          provide: ScheduleRepository,
          useValue: mock<ScheduleRepository>(),
        },
        {
          provide: SeatRepository,
          useValue: mock<SeatRepository>(),
        },
      ],
    }).compile();

    eventService = moduleRef.get(EventService);
    eventRepository = moduleRef.get(EventRepository);
    scheduleRepository = moduleRef.get(ScheduleRepository);
    seatRepository = moduleRef.get(SeatRepository);

    eventRepository.findAll.mockResolvedValue([event]);
    scheduleRepository.findBetween.mockResolvedValue([schedule]);
    scheduleRepository.findById.mockResolvedValue(schedule);
    seatRepository.findAvailables.mockResolvedValue([seat]);
  });

  describe('이벤트 목록 조회', () => {
    it('모든 이벤트 목록을 조회합니다.', async () => {
      const result = await eventService.findAll();

      expect(result).toEqual([event]);
    });
  });

  describe('예약 가능한 날짜 조회', () => {
    it('특정 콘서트의 예약 가능한 날짜를 조회합니다.', async () => {
      const result = await eventService.findSchedulesBetween({
        startDate: LocalDateTime.now(),
        endDate: LocalDateTime.now(),
      });

      expect(result).toEqual([schedule]);
    });
  });

  describe('예약 가능한 좌석 조회', () => {
    it('특정 스케줄의 예약 가능한 좌석을 조회합니다.', async () => {
      const scheduleId = '1';

      const result = await eventService.findAvailableSeats(scheduleId);

      expect(result).toEqual([seat]);
    });

    it('스케줄이 존재하지 않으면 좌석을 조회할 수 없습니다.', async () => {
      const scheduleId = '1';
      scheduleRepository.findById.mockResolvedValueOnce(null);

      await expect(
        eventService.findAvailableSeats(scheduleId),
      ).rejects.toThrow();
    });
  });
});
