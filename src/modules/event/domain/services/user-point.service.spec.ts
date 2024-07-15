import { LocalDateTime } from '@lib/types';
import { DomainError } from '@lib/errors';
import { mock, MockProxy } from 'jest-mock-extended';
import Decimal from 'decimal.js';
import { UserPointService } from './user-point.service';
import { UserPointRepository } from '../repositories';
import { UserPoint } from '../models';

const userPoint = UserPoint.from({
  userId: '1',
  balance: new Decimal(10_000),
  updatedDate: LocalDateTime.now(),
});

describe('UserPointService', () => {
  let userPointRepository: MockProxy<UserPointRepository>;
  let service: UserPointService;

  beforeEach(() => {
    userPointRepository = mock<UserPointRepository>();
    service = new UserPointService(userPointRepository);

    userPointRepository.findById.mockResolvedValue(userPoint);
  });

  describe('포인트 결제', () => {
    it('포인트로 결제합니다.', async () => {
      const userId = '1';
      const amount = new Decimal(1_000);

      const result = await service.pay({ userId, amount });

      expect(result).toEqual(userPoint);
      expect(userPointRepository.save).toHaveBeenCalledWith(userPoint);
    });

    describe('결제에 실패하는 경우', () => {
      it('사용자를 찾을 수 없을 경우', () => {
        const userId = '1';
        const amount = new Decimal(1_000);
        userPointRepository.findById.mockResolvedValue(null);

        return expect(service.pay({ userId, amount })).rejects.toThrow(
          DomainError.unauthorized('사용자를 찾을 수 없습니다.'),
        );
      });
    });
  });
});
