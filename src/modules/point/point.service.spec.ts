import { PointEntity } from './point.entity';
import { PointRepository } from './point.repository';
import { PointService } from './point.service';
import { MockProxy, mock } from 'jest-mock-extended';

const pointEntity = PointEntity.of({
  userId: '1',
  balance: '100',
  updatedDate: new Date(),
});

describe('PointService', () => {
  let service: PointService;
  let mockRepository: MockProxy<PointRepository>;

  beforeEach(() => {
    mockRepository = mock<PointRepository>();
    mockRepository.findByUserId.mockResolvedValue(pointEntity);
    service = new PointService(mockRepository);
  });

  describe('사용자 포인트 조회', () => {
    it('사용자의 포인트를 조회합니다.', async () => {
      // Given
      const userId = '1';

      // When
      const result = await service.find(userId);

      // Then
      const expected = PointEntity.of({
        userId,
        balance: '100',
        updatedDate: expect.any(Date),
      });
      expect(result.equals(expected)).toBe(true);
    });

    it('사용자가 없을 경우 포인트는 0원입니다.', async () => {
      // Given
      const userId = '2';
      jest.spyOn(mockRepository, 'findByUserId').mockResolvedValueOnce(null);

      // When
      const result = await service.find(userId);

      // Then
      const expected = PointEntity.of({
        userId,
        balance: '0',
        updatedDate: expect.any(Date),
      });
      expect(result.equals(expected)).toBe(true);
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
      const expected = PointEntity.of({
        userId,
        balance: '200',
        updatedDate: expect.any(Date),
      });
      expect(result.equals(expected)).toBe(true);
      expect(mockRepository.save).toHaveBeenCalledWith(expected);
    });

    it('사용자가 없을 경우 포인트를 생성합니다.', async () => {
      // Given
      const userId = '2';
      const amount = '100';
      jest.spyOn(mockRepository, 'findByUserId').mockResolvedValueOnce(null);

      // When
      await service.charge(userId, amount);

      // Then
      const expected = PointEntity.of({
        userId,
        balance: '100',
        updatedDate: expect.any(Date),
      });
      expect(mockRepository.save).toHaveBeenCalledWith(expected);
    });
  });
});
