import { LocalDateTime } from '@libs/domain/types';
import { ResponseEntity } from '../../lib/response';
import { EventController } from './event.controller';
import { EventResponse } from '../dto/responses';
import { mock, MockProxy } from 'jest-mock-extended';
import { FindEventsUseCase } from '../../application/usecases';
import { Event } from '../../domain/models';

const event = Event.create({
  title: 'title',
  address: 'address',
  startDate: LocalDateTime.now(),
  endDate: LocalDateTime.now(),
});

describe('EventController', () => {
  let findEventsUseCase: MockProxy<FindEventsUseCase>;
  let controller: EventController;

  beforeEach(() => {
    findEventsUseCase = mock<FindEventsUseCase>();
    controller = new EventController(findEventsUseCase);

    findEventsUseCase.execute.mockResolvedValue([event]);
  });

  it('이벤트 목록을 조회합니다.', async () => {
    const result = await controller.findAll();

    expect(result).toEqual(
      ResponseEntity.okWith([EventResponse.fromModel(event)]),
    );
  });
});
