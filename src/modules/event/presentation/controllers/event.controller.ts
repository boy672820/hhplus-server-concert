import { ResponseEntity } from '@lib/response';
import { Controller, Get, Param } from '@nestjs/common';
import { ScheduleResponse } from '../dto/responses';

@Controller('events')
export class EventController {
  @Get(':eventId/schedules/available')
  findAvailableSchedules(
    @Param('eventId') eventId: string,
  ): Promise<ResponseEntity<ScheduleResponse[]>> {
    return Promise.resolve(
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
  }
}
