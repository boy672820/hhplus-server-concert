import { ResponseEntity } from '@lib/response';
import { EventController } from './event.controller';
import { ScheduleResponse } from '../dto/responses';

describe('EventController', () => {
  let controller: EventController;

  beforeEach(() => {
    controller = new EventController();
  });

  it('예약 가능한 날짜를 조회합니다.', async () => {
    // Given
    const eventId = '1';

    // When
    const result = await controller.findAvailableSchedules(eventId);

    // Then
    expect(result).toEqual(
      ResponseEntity.okWith(
        [
          { id: '1', date: '2024-08-01' },
          { id: '2', date: '2024-08-02' },
          { id: '3', date: '2024-08-03' },
          { id: '4', date: '2024-08-04' },
          { id: '5', date: '2024-08-05' },
        ].map(ScheduleResponse.of),
      ),
    );
  });
});
