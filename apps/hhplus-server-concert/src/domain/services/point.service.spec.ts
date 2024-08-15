import { LocalDateTime } from '@libs/domain/types';
import { DomainError } from '@libs/common/errors';
import { MockProxy, mock } from 'jest-mock-extended';
import Decimal from 'decimal.js';
import { Point } from '../models';
import { PointService } from './point.service';
import { PointRepository } from '../repositories';

const point = Point.from({
  userId: '1',
  balance: new Decimal(100),
  updatedDate: LocalDateTime.now(),
});

describe('PointService', () => {
  let service: PointService;
  let pointRepository: MockProxy<PointRepository>;

  beforeEach(() => {
    pointRepository = mock<PointRepository>();
    pointRepository.findByUserId.mockResolvedValue(point);
    service = new PointService(pointRepository);
  });

  describe('사용자 포인트 조회', () => {
    it('사용자의 포인트를 조회합니다.', async () => {
      // Given
      const userId = '1';

      // When
      const result = await service.find(userId);

      // Then
      const expected = Point.from({
        userId,
        balance: new Decimal(100),
        updatedDate: expect.any(LocalDateTime),
      });
      expect(result).toEqual(expected);
    });

    it('사용자가 없을 경우 포인트는 0원입니다.', async () => {
      // Given
      const userId = '2';
      jest.spyOn(pointRepository, 'findByUserId').mockResolvedValueOnce(null);

      // When
      const result = await service.find(userId);

      // Then
      const expected = Point.from({
        userId,
        balance: new Decimal(0),
        updatedDate: expect.any(LocalDateTime),
      });
      expect(result).toEqual(expected);
    });
  });

  describe('포인트 충전', () => {
    it('사용자의 포인트를 충전합니다.', async () => {
      // Given
      const userId = '1';
      const amount = '100';

      // When
      const result = await service.charge(userId, amount);

      // Then
      const expected = Point.from({
        userId,
        balance: new Decimal(200),
        updatedDate: expect.any(LocalDateTime),
      });
      expect(result).toEqual(expected);
      expect(pointRepository.save).toHaveBeenCalledWith(expected);
    });

    it('사용자가 없을 경우 포인트를 생성합니다.', async () => {
      // Given
      const userId = '2';
      const amount = '100';
      jest.spyOn(pointRepository, 'findByUserId').mockResolvedValueOnce(null);

      // When
      await service.charge(userId, amount);

      // Then
      const expected = Point.from({
        userId,
        balance: new Decimal(100),
        updatedDate: expect.any(LocalDateTime),
      });
      expect(pointRepository.save).toHaveBeenCalledWith(expected);
    });
  });

  describe('포인트 결제', () => {
    it('포인트로 결제합니다.', async () => {
      const userId = '1';
      const amount = new Decimal(50);
      const spyOnPay = jest.spyOn(point, 'pay');

      const result = await service.pay({ userId, amount });

      expect(result).toBeInstanceOf(Point);
      expect(spyOnPay).toHaveBeenCalledWith(amount);
      expect(pointRepository.save).toHaveBeenCalledWith(point);
    });

    describe('결제에 실패하는 경우', () => {
      it('사용자를 찾을 수 없을 경우', () => {
        const userId = '1';
        const amount = new Decimal(1_000);
        pointRepository.findByUserId.mockResolvedValueOnce(null);

        return expect(service.pay({ userId, amount })).rejects.toThrow(
          DomainError.limitExceeded('잔액이 부족합니다.'),
        );
      });
    });
  });
});
