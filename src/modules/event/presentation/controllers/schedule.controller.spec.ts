import { SeatStatus } from '@lib/types';
import { ResponseEntity } from '@lib/response';
import { ScheduleController } from './schedule.controller';
import { SeatResponse } from '../dto/responses';

describe('ScheduleController', () => {
  let controller: ScheduleController;

  beforeEach(() => {
    controller = new ScheduleController();
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
