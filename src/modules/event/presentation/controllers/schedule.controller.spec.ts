import { LocalDateTime } from '@lib/types';
import { ResponseEntity } from '@lib/response';
import { mock, MockProxy } from 'jest-mock-extended';
import { ScheduleController } from './schedule.controller';
import { ScheduleResponse, SeatResponse } from '../dto/responses';
import {
  FindSchedulesBetweenUseCase,
  FindAvailableSeatsUseCase,
} from '../../application/usecases';
import { Schedule, Seat } from '../../domain/models';

const schedule = Schedule.create({
  startDate: LocalDateTime.now(),
  endDate: LocalDateTime.now(),
});
const seat = Seat.create({ eventId: '1', number: 1 });

describe('ScheduleController', () => {
  let findSchedulesBetweenUseCase: MockProxy<FindSchedulesBetweenUseCase>;
  let findAvailableSeatsUseCase: MockProxy<FindAvailableSeatsUseCase>;
  let controller: ScheduleController;

  beforeEach(() => {
    findSchedulesBetweenUseCase = mock<FindSchedulesBetweenUseCase>();
    findAvailableSeatsUseCase = mock<FindAvailableSeatsUseCase>();
    controller = new ScheduleController(
      findSchedulesBetweenUseCase,
      findAvailableSeatsUseCase,
    );

    findSchedulesBetweenUseCase.execute.mockResolvedValue([schedule]);
    findAvailableSeatsUseCase.execute.mockResolvedValue([seat]);
  });

  it('스케줄 목록을 조회합니다.', async () => {
    const result = await controller.findBetween(
      LocalDateTime.now(),
      LocalDateTime.now(),
    );

    expect(result).toEqual(
      ResponseEntity.okWith([ScheduleResponse.fromModel(schedule)]),
    );
  });

  it('스케줄의 좌석을 조회합니다.', async () => {
    // Given
    const scheduleId = '1';

    // When
    const result = await controller.findAvailableSeats(scheduleId);

    // Then
    expect(result).toEqual(
      ResponseEntity.okWith([SeatResponse.fromModel(seat)]),
    );
  });
});
