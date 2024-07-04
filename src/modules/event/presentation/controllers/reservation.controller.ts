import { ReservationStatus } from '@lib/types';
import { ResponseEntity } from '@lib/response';
import { Controller, Body, Post } from '@nestjs/common';
import { ReservationResponse } from '../dto/responses';

@Controller('reservations')
export class ReservationController {
  @Post()
  reserve(@Body() body: any): Promise<ResponseEntity<ReservationResponse>> {
    body;
    return Promise.resolve(
      ResponseEntity.okWith(
        ReservationResponse.of({
          id: '1',
          scheduleDate: '2024-08-01',
          seatNumber: 1,
          status: ReservationStatus.TempAssigned,
          event: {
            id: '1',
            title: '행사',
            address: '서울',
            startDate: '2024-08-01',
            endDate: '2024-08-31',
          },
          reservedDate: new Date(),
          expiredDate: new Date(),
        }),
      ),
    );
  }
}
