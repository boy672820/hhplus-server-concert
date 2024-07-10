import { LocalDateTime } from '@lib/types';
import { Test } from '@nestjs/testing';
import { mock, MockProxy } from 'jest-mock-extended';
import { EventService } from './event.service';
import { EventRepository, ScheduleRepository } from '../repositories';
import { Event, Schedule } from '../models';

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

describe('EventService', () => {
  let eventService: EventService;
  let eventRepository: MockProxy<EventRepository>;
  let scheduleRepository: MockProxy<ScheduleRepository>;

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
      ],
    }).compile();

    eventService = moduleRef.get(EventService);
    eventRepository = moduleRef.get(EventRepository);
    scheduleRepository = moduleRef.get(ScheduleRepository);

    scheduleRepository.findAvailables.mockResolvedValue([schedule]);

    eventRepository.findAll.mockResolvedValue([event]);
  });

  describe('이벤트 목록 조회', () => {
    it('모든 이벤트 목록을 조회합니다.', async () => {
      const result = await eventService.findAll();

      expect(result).toEqual([event]);
    });
  });

  describe('예약 가능한 날짜 조회', () => {
    it('특정 콘서트의 예약 가능한 날짜를 조회합니다.', async () => {
      const result = await eventService.findAvailableSchedules({
        startDate: LocalDateTime.now(),
        endDate: LocalDateTime.now(),
      });

      expect(result).toEqual([schedule]);
    });
  });
});
