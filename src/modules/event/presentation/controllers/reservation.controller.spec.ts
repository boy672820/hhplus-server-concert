import { ReservationStatus } from '@lib/types';
import { ResponseEntity } from '@lib/response';
import { ReservationResponse } from '../dto/responses';
import { ReservationController } from './reservation.controller';

describe('ReservationController', () => {
  let controller: ReservationController;

  beforeEach(() => {
    controller = new ReservationController();
  });

  it('좌석을 예약합니다.', async () => {
    // Given
    const user = { userId: '1' };
    const seatId = '1';

    // When
    const result = await controller.reserve(user, { seatId });

    // Then
    expect(result).toEqual(
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
          reservedDate: expect.any(Date),
          expiredDate: expect.any(Date),
        }),
      ),
    );
  });
});
