import { ResponseEntity } from '@lib/response';
import { PaymentController } from './payment.controller';
import { PaymentResponse } from '../dto/responses';

describe('PaymentController', () => {
  let controller: PaymentController;

  beforeEach(() => {
    controller = new PaymentController();
  });

  it('예약된 좌석을 결제합니다.', async () => {
    // Given
    const user = { userId: '1' };
    const reservationId = '1';

    // When
    const result = await controller.pay(user, { reservationId });

    // Then
    expect(result).toEqual(
      ResponseEntity.okWith(
        PaymentResponse.of({
          reservationId: '1',
          amount: '220000',
          createdDate: expect.any(Date),
        }),
      ),
    );
  });
});
