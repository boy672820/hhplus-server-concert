import { ResponseEntity } from '../../lib/response';
import { mock, MockProxy } from 'jest-mock-extended';
import { PaymentController } from './payment.controller';
import { PaymentResponse } from '../dto/responses';
import { PayReservationUseCase } from '../../application/usecases';
import { Payment } from '../../domain/models';
import Decimal from 'decimal.js';

const payment = Payment.create({
  reservationId: '1',
  amount: new Decimal(100),
});

describe('PaymentController', () => {
  let payReservationUseCase: MockProxy<PayReservationUseCase>;
  let controller: PaymentController;

  beforeEach(() => {
    payReservationUseCase = mock<PayReservationUseCase>();
    controller = new PaymentController(payReservationUseCase);

    payReservationUseCase.execute.mockResolvedValue(payment);
  });

  it('예약된 좌석을 결제합니다.', async () => {
    // Given
    const user = { userId: '1' };
    const reservationId = '1';

    // When
    const result = await controller.pay(user, { reservationId });

    // Then
    expect(result).toEqual(
      ResponseEntity.okWith(PaymentResponse.fromModel(payment)),
    );
  });
});
