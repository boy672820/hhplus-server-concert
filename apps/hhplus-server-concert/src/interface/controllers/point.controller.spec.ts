import { LocalDateTime } from '@libs/domain/types';
import { ResponseEntity } from '../../lib/response';
import { MockProxy, mock } from 'jest-mock-extended';
import Decimal from 'decimal.js';
import { Point } from '../../domain/models';
import { PointController } from './point.controller';
import { PointService } from '../../domain/services';
import { PointResponse } from '../dto/responses';

const point = Point.from({
  userId: '1',
  balance: new Decimal('100'),
  updatedDate: LocalDateTime.now(),
});

describe('PointController', () => {
  let controller: PointController;
  let pointService: MockProxy<PointService>;

  beforeEach(async () => {
    pointService = mock<PointService>();
    pointService.find.mockResolvedValue(point);
    pointService.charge.mockResolvedValue(point);
    controller = new PointController(pointService);
  });

  it('내 포인트를 조회합니다.', async () => {
    // Given
    const user = { userId: '1' };

    // When
    const result = await controller.my(user);

    // Then
    const model = Point.from({
      userId: '1',
      balance: new Decimal('100'),
      updatedDate: expect.any(Date),
    });
    expect(result).toEqual(
      ResponseEntity.okWith(PointResponse.fromModel(model)),
    );
  });

  it('포인트를 충전합니다.', async () => {
    // Given
    const user = { userId: '1' };
    const amount = '100000';

    // When
    const result = await controller.charge(user, { amount });

    // Then
    const entity = Point.from({
      userId: '1',
      balance: new Decimal('100'),
      updatedDate: expect.any(Date),
    });
    expect(result).toEqual(
      ResponseEntity.okWith(PointResponse.fromModel(entity)),
    );
  });
});
