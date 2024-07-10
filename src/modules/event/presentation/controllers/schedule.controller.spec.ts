import { LocalDateTime, SeatStatus } from '@lib/types';
import { ResponseEntity } from '@lib/response';
import { mock, MockProxy } from 'jest-mock-extended';
import { ScheduleController } from './schedule.controller';
import { ScheduleResponse, SeatResponse } from '../dto/responses';
import { FindSchedulesBetweenUseCase } from '../../application/usecases';
import { Schedule } from '../../domain/models';

const schedule = Schedule.create({
  startDate: LocalDateTime.now(),
  endDate: LocalDateTime.now(),
});

describe('ScheduleController', () => {
  let findSchedulesBetweenUseCase: MockProxy<FindSchedulesBetweenUseCase>;
  let controller: ScheduleController;

  beforeEach(() => {
    findSchedulesBetweenUseCase = mock<FindSchedulesBetweenUseCase>();
    controller = new ScheduleController(findSchedulesBetweenUseCase);

    findSchedulesBetweenUseCase.execute.mockResolvedValue([schedule]);
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
    const result = await controller.findSeats(scheduleId);

    // Then
    expect(result).toEqual(
      ResponseEntity.okWith(
        Array.from({ length: 10 }, (_, index) =>
          SeatResponse.of({
            id: index.toString(),
            number: index + 1,
            status: SeatStatus.Pending,
          }),
        ),
      ),
    );
  });
});
