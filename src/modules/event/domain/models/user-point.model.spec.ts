import { LocalDateTime } from '@lib/types';
import Decimal from 'decimal.js';
import { UserPoint } from './user-point.model';
import { DomainError } from '../../../../lib/errors';

describe('UserPointModel', () => {
  let userPoint: UserPoint;

  beforeEach(() => {
    userPoint = UserPoint.from({
      userId: '1',
      balance: new Decimal(10_000),
      updatedDate: LocalDateTime.now(),
    });
  });

  describe('결제', () => {
    it('결제처리하여 포인트를 차감시킵니다.', () => {
      const amount = new Decimal(1_000);

      userPoint.pay(amount);

      expect(userPoint.balance.eq(9_000)).toBeTruthy();
    });

    describe('결제에 실패하는 경우', () => {
      it('포인트가 부족합니다.', () => {
        const amount = new Decimal(20_000);

        expect(() => userPoint.pay(amount)).toThrow(
          DomainError.limitExceeded('포인트가 부족합니다.'),
        );
      });
    });
  });
});
