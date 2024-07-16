import { DomainError } from '@lib/errors';
import Decimal from 'decimal.js';
import { Point } from './point.model';

describe('UserPointModel', () => {
  let point: Point;

  beforeEach(() => {
    point = Point.from({
      userId: '1',
      balance: new Decimal(10_000),
      updatedDate: new Date(),
    });
  });

  describe('결제', () => {
    it('결제처리하여 포인트를 차감시킵니다.', () => {
      const amount = new Decimal(1_000);

      point.pay(amount);

      expect(point.balance.eq(9_000)).toBeTruthy();
    });

    describe('결제에 실패하는 경우', () => {
      it('포인트가 부족합니다.', () => {
        const amount = new Decimal(20_000);

        expect(() => point.pay(amount)).toThrow(
          DomainError.limitExceeded('잔액이 부족합니다.'),
        );
      });
    });
  });
});
