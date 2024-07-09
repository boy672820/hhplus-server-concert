import { LocalDateTime } from '@lib/types';
import { Test } from '@nestjs/testing';
import { mock, MockProxy } from 'jest-mock-extended';
import { EventService } from './event.service';
import { EventRepository } from '../repositories';
import { Event } from '../models';

const event = Event.create({
  title: '이벤트1',
  address: '',
  startDate: LocalDateTime.now(),
  endDate: LocalDateTime.now(),
});

describe('EventService', () => {
  let eventService: EventService;
  let eventRepository: MockProxy<EventRepository>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        EventService,
        {
          provide: EventRepository,
          useValue: mock<EventRepository>(),
        },
      ],
    }).compile();

    eventService = moduleRef.get(EventService);
    eventRepository = moduleRef.get(EventRepository);

    eventRepository.findAll.mockResolvedValue([event]);
  });

  describe('이벤트 목록 조회', () => {
    it('모든 이벤트 목록을 조회합니다.', async () => {
      const result = await eventService.findAll();

      expect(result).toEqual([event]);
    });
  });
});
