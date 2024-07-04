import { SeatStatus } from '@lib/types';
import { ResponseEntity } from '@lib/response';
import { Controller, Get, Param } from '@nestjs/common';
import { SeatResponse } from '../dto/responses';

@Controller('schedules')
export class ScheduleController {
  @Get(':scheduleId/seats')
  findSeats(
    @Param('scheduleId') scheduleId: string,
  ): Promise<ResponseEntity<SeatResponse[]>> {
    return Promise.resolve(
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
  }
}
