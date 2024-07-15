import { mock, MockProxy } from 'jest-mock-extended';
import Decimal from 'decimal.js';
import { PaymentService } from './payment.service';
import { PaymentRepository } from '../repositories';
import { Payment } from '../models';

describe('PaymentService', () => {
  let paymentRepository: MockProxy<PaymentRepository>;
  let service: PaymentService;

  beforeEach(() => {
    paymentRepository = mock<PaymentRepository>();
    service = new PaymentService(paymentRepository);
  });

  describe('결제정보 생성', () => {
    it('결제 정보를 생성합니다.', async () => {
      // given
      const reservationId = '1';
      const amount = new Decimal(1000);

      // when
      const result = await service.create({ reservationId, amount });

      // then
      expect(result).toBeInstanceOf(Payment);
      expect(paymentRepository.save).toHaveBeenCalled();
    });
  });
});
