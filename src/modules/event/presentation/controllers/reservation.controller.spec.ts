import { LocalDateTime } from '@lib/types';
import { ResponseEntity } from '@lib/response';
import { mock, MockProxy } from 'jest-mock-extended';
import { ReservationResponse } from '../dto/responses';
import { ReservationController } from './reservation.controller';
import { ReserveUseCase } from '../../application/usecases';
import { Reservation } from '../../domain/models';
import Decimal from 'decimal.js';

const reservation = Reservation.create({
  userId: '1',
  eventId: '1',
  seatId: '1',
  eventTitle: 'title',
  eventAddress: 'address',
  eventStartDate: LocalDateTime.now(),
  eventEndDate: LocalDateTime.now(),
  seatNumber: 1,
  price: new Decimal(10000),
  scheduleStartDate: LocalDateTime.now(),
  scheduleEndDate: LocalDateTime.now(),
});

describe('ReservationController', () => {
  let reserveUseCase: MockProxy<ReserveUseCase>;
  let controller: ReservationController;

  beforeEach(() => {
    reserveUseCase = mock<ReserveUseCase>();
    controller = new ReservationController(reserveUseCase);

    reserveUseCase.execute.mockResolvedValue(reservation);
  });

  it('좌석을 예약합니다.', async () => {
    // Given
    const user = { userId: '1' };
    const seatId = '1';

    // When
    const result = await controller.reserve(user, { seatId });

    // Then
    expect(result).toEqual(
      ResponseEntity.okWith(ReservationResponse.fromModel(reservation)),
    );
  });
});
